# Week 2 Plan — Attendance Management System

> **Prepared by:** Pratham Naik  
> **Review Date:** Week of 11 August 2026  
> **Branch:** `dev`

---

## Week 1 Recap (Completed ✅)

| Area | Status |
|------|--------|
| Monorepo + Git workflow | ✅ Done |
| Versioned migrations (node-pg-migrate) | ✅ Done — 9 migrations, 21 tables |
| Full database schema (all entities) | ✅ Done |
| `ltree` hierarchy + GiST index | ✅ Done |
| RBAC tables (roles, permissions) | ✅ Done |
| Audit logs + `move_position_subtree` fn | ✅ Done |
| GIN indexes on JSONB columns | ✅ Done |
| Docker environment (postgres + backend + frontend) | ✅ Done |
| Auth Factory (org register, org login, employee login) | ✅ Done |
| JWT with position path embedded | ✅ Done |

---

## Week 2 Focus

> **Supervisor directive:** Basic auth + core schema + one simple feature loop.

Auth is operational. Schema is finalized. This week's goal is to complete the auth surface and deliver the first working end-to-end feature — a user can log in and mark attendance.

---

## Deliverable 1 — Complete the Auth Surface

**Goal:** An org admin can create employees. An employee can accept an invite and set their password.

### Tasks
- `POST /api/org/employees` — Org admin creates an employee record (person + optional position assignment)
- `POST /api/auth/invite/accept` — Employee accepts invite token and sets their password
- `GET /api/org/employees` — List all employees in the organization (paginated)
- `GET /api/org/employees/:id` — Get a single employee's profile

**Why this week:** Without this, there is no way to populate the system with employees. Every other feature (attendance, leaves) requires employees to exist.

---

## Deliverable 2 — Attendance Feature Loop (The Core)

**Goal:** A working, end-to-end attendance flow that a real employee could use.

### Tasks
- `POST /api/attendance/check-in` — Employee marks check-in (validates not already checked in today)
- `POST /api/attendance/check-out` — Employee marks check-out (calculates `total_hours`)
- `GET /api/attendance/me` — Employee views their own attendance history
- `GET /api/attendance/team` — Manager views their team's attendance (uses `ltree` path from JWT)

**Why this is the right first feature:** It exercises the most important architectural pieces — multi-tenancy, the JWT, and the ltree hierarchy query. If this works correctly, the foundation is proven end-to-end.

**Key business rule:** One attendance row per person per work_date. A unique constraint on `(organization_id, person_id, work_date)` already exists from migration 004.

---

## Deliverable 3 — Leave Request Feature Loop

**Goal:** An employee can submit a leave request and a manager can approve or reject it.

### Tasks
- `POST /api/leaves/request` — Employee submits a leave request
- `GET /api/leaves/me` — Employee views their own requests and balances
- `GET /api/leaves/team/pending` — Manager views pending requests from their team
- `PATCH /api/leaves/request/:id/action` — Manager approves or rejects

**Why this week:** Leaves depend on the attendance data and hierarchy — building it now delivers a second complete, demonstrable feature loop.

---

## Technical Approach

### Middleware Stack for Protected Routes
All protected routes will use:
```
requireAuth → requireTenant → controller
```

### Manager Access Pattern (ltree in action)
```sql
WHERE pos.path <@ $1  -- manager's position_path from JWT token
```
No extra DB lookup needed to resolve subordinates.

### Consistent API Response Format
Success:
```json
{ "status": "success", "data": { } }
```
Error:
```json
{ "status": "error", "statusCode": 400, "message": "..." }
```

---

## What Is NOT in Scope This Week

| Feature | Reason Deferred |
|---------|----------------|
| Payroll calculation | Requires leave + attendance data first |
| Performance reviews | Requires employees + positions to be populated |
| QR-based check-in | Requires frontend kiosk UI |
| Email delivery for invites | Requires external SMTP service setup |

---

## Definition of Done

A deliverable is complete when:
1. The endpoint accepts valid input and returns the correct response
2. Invalid input returns a descriptive error (not a 500)
3. Tenant isolation is enforced — org A cannot read org B's data
4. The change is committed to `dev` with a clear commit message
