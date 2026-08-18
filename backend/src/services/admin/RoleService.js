import { db } from '../../db/index.js';

export class RoleService {
  static async getRoles(orgId) {
    const res = await db.query('SELECT * FROM roles WHERE org_id = $1', [orgId]);
    return res.rows;
  }

  static async getPermissions() {
    const res = await db.query('SELECT * FROM permissions');
    return res.rows;
  }

  static async assignPermissions(roleId, permissionIds) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);
      
      for (const pId of permissionIds) {
        await client.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [roleId, pId]);
      }
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}
