import { db } from '../../db/index.js';

export class ReportService {
  static async getAttendanceReport(orgId, startDate, endDate) {
    const res = await db.query(`
      SELECT e.id as employee_id, e.first_name, e.last_name, count(a.id) as days_present 
      FROM employees e
      LEFT JOIN attendance a ON e.id = a.employee_id AND a.date >= $2 AND a.date <= $3
      WHERE e.org_id = $1
      GROUP BY e.id, e.first_name, e.last_name
    `, [orgId, startDate, endDate]);
    return res.rows;
  }

  static async getLeaveReport(orgId, startDate, endDate) {
    const res = await db.query(`
      SELECT e.id as employee_id, e.first_name, e.last_name, l.status, count(l.id) as total_leaves
      FROM employees e
      JOIN leave_requests l ON e.id = l.employee_id
      WHERE e.org_id = $1 AND l.start_date >= $2 AND l.end_date <= $3
      GROUP BY e.id, e.first_name, e.last_name, l.status
    `, [orgId, startDate, endDate]);
    return res.rows;
  }
}
