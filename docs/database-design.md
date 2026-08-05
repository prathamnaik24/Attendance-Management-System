# Database Schema & Design Decisions

This document outlines the core architectural choices and the proposed schema structure for the Attendance Management System.

## Architectural Decisions

### 1. Hierarchy Modeling: `ltree`
We use the **ltree** PostgreSQL extension to model the organizational hierarchy (e.g., who reports to whom).
- **Why:** Faster deep-tree queries, easier mutability (moving a manager moves their whole team), and native pattern matching.
- **Implementation:** Hierarchy is attached to **Positions**, not Persons. This allows any person occupying a management position to automatically "inherit" the management of positions below them.

### 2. Multi-tenancy: UUIDs
All primary keys use `UUID` (`gen_random_uuid()`).
- **Why:** Prevents ID collision if tenant databases are ever merged, partitioned, or sharded.

### 3. Timestamps: `timestamptz`
All date/time columns that represent a specific moment use `TIMESTAMPTZ`.
- **Why:** To safely handle organizations spanning multiple time zones.

### 4. Monetary Values: `NUMERIC(15,2)`
All salary/payroll amounts use exact decimals.
- **Why:** Floating point (`FLOAT`/`REAL`) rounding errors are unacceptable in payroll.

---

## Proposed Schema 

### 1. Organization & Structure

**`organizations`**
- `id` (UUID, PK)
- `name` (TEXT)
- `slug` (TEXT, UNIQUE)
- `type` (TEXT) - e.g., Corporate, Educational
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

**`departments`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `name` (TEXT)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

**`positions` (The Hierarchy Tree)**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `department_id` (UUID, FK -> departments)
- `title` (TEXT) - e.g., 'Senior Software Engineer'
- `code` (TEXT) - Unique per org
- `path` (LTREE) - e.g., 'acme.engineering.backend.senior_engineer'
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

---

### 2. People & Assignments

**`persons`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `employee_code` (TEXT) - Unique per org
- `first_name` (TEXT)
- `last_name` (TEXT)
- `email` (TEXT, UNIQUE)
- `password_hash` (TEXT)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

**`position_assignments`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `person_id` (UUID, FK -> persons)
- `position_id` (UUID, FK -> positions)
- `is_primary` (BOOLEAN)
- `started_at` (DATE)
- `ended_at` (DATE) - NULL means active

---

### 3. Roles & Permissions (Access Control)

**`roles`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations) - NULL = System wide
- `name` (TEXT)

**`permissions`**
- `id` (UUID, PK)
- `module` (TEXT) - e.g., 'attendance', 'payroll'
- `action` (TEXT) - e.g., 'view', 'approve'
- `scope` (TEXT) - e.g., 'own', 'department'

**`role_permissions`**
- Links Roles to Permissions

**`person_roles`**
- Links Persons to Roles

---

### 4. Modules (Attendance, Leave, Payroll)

*(To be fully defined based on Supervisor's final module structures. Expected tables below:)*

- **Attendance:** `attendance`, `holidays`
- **Leave:** `leave_types`, `leave_policies`, `leave_balances`, `leave_requests`
- **Payroll:** `salary_structures`, `payroll`, `salary_deductions`

---

## Clarifications Needed Before Migrating Rest of Schema

1. **Multi-positions:** Can one person hold multiple active positions simultaneously?
2. **Attendance Model:** Is attendance single-row per day (Present/Absent) or event-driven (Check In, Check Out, Break)?
3. **Multi-currency:** Will payroll need multi-currency support (`currency` column)?
4. **Permissions:** Are permissions dynamic rows or hardcoded system constants?
5. **Performance Module:** What entities make up the Performance module?
