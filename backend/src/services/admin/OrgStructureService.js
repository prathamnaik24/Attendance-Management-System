import { db } from '../../db/index.js';

export class OrgStructureService {
  static async getDepartments(orgId) {
    const res = await db.query('SELECT * FROM departments WHERE organization_id = $1', [orgId]);
    return res.rows;
  }

  static async getPositionsTree(orgId) {
    const res = await db.query('SELECT * FROM positions WHERE organization_id = $1 ORDER BY path', [orgId]);
    return res.rows;
  }
}
