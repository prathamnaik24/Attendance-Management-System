# Week 2 Project Status Brief: Attendance Management System


---

## 1. Executive Summary

This week, the development focus shifted from schema modeling to building the core application loops. We have successfully completed the authentication surface, built the first end-to-end employee actions (invitations, daily attendance logging, and leave management workflows), and verified the system with a robust integration test suite.

---

## 2. Backend Features Implemented This Week

The backend is built as a decoupled REST API (**Routes → Controllers → Services → PostgreSQL**) using standard design patterns:

### A. Deliverable 1: Employee Invitation & Account Setup
*   **Admins Invite Employees (`POST /api/org/employees`)**: Admins/HR can invite employees by creating a profile record. The system generates a high-entropy placeholder password to satisfy PostgreSQL `NOT NULL` constraints and issues a secure `org_invite_token` (valid for 24 hours).
*   **Employees Accept Invitations (`POST /api/auth/invite/accept`)**: Employees consume the token to set their password.
*   **Automatic Role Allocation**: On registration, new accounts are automatically associated with the default `'Employee'` role (creating the role dynamically if it is the first employee in a new organization).

### B. Deliverable 2: Daily Attendance Loop (Geofencing & Subordinate Queries)
*   **Check-In (`POST /api/attendance/check-in`)**: Logs employee check-in times. Enforces a database-level unique constraint preventing double check-ins on the same work date. Supports check-in metadata (GPS coordinates, device signature logs).
*   **Check-Out (`POST /api/attendance/check-out`)**: Closes the active session, logs check-out time, calculates total duration, and records it inside the `metadata` JSONB block (`metadata.total_hours`).
*   **Manager Subordinate Containment (`GET /api/attendance/team`)**: Enables managers to fetch attendance logs for all reporting staff under their hierarchical subtree in a single query using the **PostgreSQL `ltree` containment operator `<@`**.

### C. Deliverable 3: Leave Request Workflow
*   **Submission (`POST /api/leaves/request`)**: Employees submit leave requests. The system automatically initializes default leave balances (e.g. 10.0 days) based on organization policies, calculates request duration, and pre-deducts days from the balance to avoid double-booking.
*   **Manager Review Queue (`GET /api/leaves/team/pending`)**: Displays pending requests for subordinates (automatically excluding the manager's own requests).
*   **Rejection Reversals (`PATCH /api/leaves/request/:id/action`)**: Approvals lock in the deduction; rejections automatically restore pre-deducted days back to the employee's balance.

### D. Architectural Highlights
*   **Factory Design Pattern**: Used in [AuthFactory.js](file:///Users/shajo/Attendance-Management-System/backend/src/services/auth/AuthFactory.js) to resolve authentication strategies dynamically for organization administrators (`OrgAuthService`) and standard employees (`EmployeeAuthService`).
*   **Tenant Isolation**: Implemented in [tenant.js](file:///Users/shajo/Attendance-Management-System/backend/src/middlewares/tenant.js) to extract organization context from JWT tokens, laying the groundwork for PostgreSQL Row-Level Security (RLS).

---

## 3. Current Frontend Pages & Integration Status

The frontend is a React + Vite application styled with Tailwind CSS, configured with an Axios client interceptor to attach JWT credentials dynamically:

1.  **Home Page (`/`)** — [Home.jsx](file:///Users/shajo/Attendance-Management-System/frontend/src/pages/Home.jsx):
    *   A clean routing gateway to select entryways for Admin/HR registration vs. Employee portals.
2.  **Organization Registration (`/register`)** — [OrgRegister.jsx](file:///Users/shajo/Attendance-Management-System/frontend/src/pages/auth/OrgRegister.jsx):
    *   Form layout to register a new tenant company and its primary system administrator.
3.  **Admin/HR Login (`/login`)** — [OrgLogin.jsx](file:///Users/shajo/Attendance-Management-System/frontend/src/pages/auth/OrgLogin.jsx):
    *   Admin login portal returning JWT context.
4.  **Employee Login (`/employee-login`)** — [EmployeeLogin.jsx](file:///Users/shajo/Attendance-Management-System/frontend/src/pages/auth/EmployeeLogin.jsx):
    *   Tenant-scoped login form requiring company URL slug, email, and password.
5.  **Workspace Dashboard (`/dashboard`)** — [Dashboard.jsx](file:///Users/shajo/Attendance-Management-System/frontend/src/pages/Dashboard.jsx):
    *   A generic dashboard shell that automatically fetches and displays the authenticated user profile from `/api/auth/me`.

---

## 4. Quality Assurance & Test Coverage

We installed `vitest` and `supertest` in the backend to ensure all features are regression-tested. 

**All 40 integration tests are passing successfully**:
*   `auth.test.js` (17 tests): Validates organization signup, login details, employee login routing, and profile endpoints.
*   `org.test.js` (10 tests): Validates employee creations, paginated lists, unique emails per-organization, and invite token actions.
*   `attendance.test.js` (7 tests): Validates check-in/out logic, duplicate blocks, elapsed duration math, and manager `ltree` visibility filters.
*   `leaves.test.js` (6 tests): Validates leave requests, policy allowances configuration, and rejection balance restoration.
