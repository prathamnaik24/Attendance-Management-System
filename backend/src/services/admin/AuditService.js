import { db } from '../../db/index.js';

export class AuditService {
  static async getAuditLogs(orgId, limit = 50, offset = 0) {
    const res = await db.query(
      'SELECT * FROM audit_logs WHERE org_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [orgId, limit, offset]
    );
    return res.rows;
  }
}
