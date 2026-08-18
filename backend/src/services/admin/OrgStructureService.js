import { db } from '../../db/index.js';

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
}
