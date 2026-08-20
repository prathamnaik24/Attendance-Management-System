import { db } from '../../db/index.js';
import { AppError } from '../../middlewares/errorHandler.js';

export class OrgStructureService {
  static async getDepartments(orgId) {
    const res = await db.query('SELECT * FROM departments WHERE organization_id = $1', [orgId]);
    return res.rows;
  }

  static async getPositionsTree(orgId) {
    const res = await db.query(`
      SELECT 
        pos.id, 
        pos.parent_id, 
        pos.title, 
        pos.path, 
        pos.is_active,
        per.first_name, 
        per.last_name
      FROM positions pos
      LEFT JOIN position_assignments pa ON pos.id = pa.position_id AND pa.is_primary = true
      LEFT JOIN persons per ON pa.person_id = per.id
      WHERE pos.organization_id = $1
      ORDER BY pos.path
    `, [orgId]);
    return res.rows;
  }

  /**
   * Create a new position. The ltree path is derived from the parent's path.
   */
  static async createPosition(orgId, { title, parent_id }) {
    if (!title || title.trim() === '') {
      throw new AppError('Position title is required', 400);
    }

    // Build ltree-safe slug from title
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

    let path;
    if (parent_id) {
      // Verify parent belongs to same org
      const parentRes = await db.query(
        'SELECT path FROM positions WHERE id = $1 AND organization_id = $2',
        [parent_id, orgId]
      );
      if (parentRes.rows.length === 0) {
        throw new AppError('Parent position not found in this organization', 404);
      }
      const parentPath = parentRes.rows[0].path;
      // Ensure uniqueness in path by appending a short suffix if needed
      path = `${parentPath}.${slug}`;
    } else {
      // Root-level: use org slug prefix to scope + position slug
      const orgRes = await db.query('SELECT slug FROM organizations WHERE id = $1', [orgId]);
      const orgSlug = orgRes.rows[0].slug.replace(/-/g, '_');
      path = `${orgSlug}.${slug}`;
    }

    // Handle path collisions by appending a counter
    const existing = await db.query(
      'SELECT id FROM positions WHERE organization_id = $1 AND path::text LIKE $2',
      [orgId, `${path}%`]
    );
    if (existing.rows.length > 0) {
      path = `${path}_${existing.rows.length}`;
    }

    const res = await db.query(
      `INSERT INTO positions (organization_id, title, parent_id, path, is_active)
       VALUES ($1, $2, $3, $4::ltree, true)
       RETURNING id, title, parent_id, path::text AS path, is_active`,
      [orgId, title.trim(), parent_id || null, path]
    );

    return res.rows[0];
  }

  /**
   * Update a position's title (path and parent cannot be changed to avoid ltree corruption).
   */
  static async updatePosition(orgId, positionId, { title }) {
    if (!title || title.trim() === '') {
      throw new AppError('Position title is required', 400);
    }

    const res = await db.query(
      `UPDATE positions SET title = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND organization_id = $3
       RETURNING id, title, parent_id, path::text AS path, is_active`,
      [title.trim(), positionId, orgId]
    );

    if (res.rows.length === 0) {
      throw new AppError('Position not found', 404);
    }
    return res.rows[0];
  }

  /**
   * Delete a position (and all its descendants via CASCADE or manually).
   */
  static async deletePosition(orgId, positionId) {
    // First, check if any persons are currently assigned to this position
    const assignmentCheck = await db.query(
      `SELECT COUNT(*) FROM position_assignments 
       WHERE position_id = $1 AND (end_date IS NULL OR end_date >= current_date)`,
      [positionId]
    );
    if (parseInt(assignmentCheck.rows[0].count) > 0) {
      throw new AppError('Cannot delete a position that has active employee assignments. Please reassign employees first.', 409);
    }

    // Delete the position (children will be cascade-deleted if FK is set, otherwise delete manually)
    const posRes = await db.query(
      'SELECT path FROM positions WHERE id = $1 AND organization_id = $2',
      [positionId, orgId]
    );
    if (posRes.rows.length === 0) {
      throw new AppError('Position not found', 404);
    }

    // Delete all descendants first (those whose path starts with this position's path)
    await db.query(
      `DELETE FROM positions WHERE organization_id = $1 AND path <@ $2::ltree AND id <> $3`,
      [orgId, posRes.rows[0].path, positionId]
    );

    await db.query('DELETE FROM positions WHERE id = $1', [positionId]);
    return { deleted: true };
  }
}
