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
- `person_id` (UUID, FK -> persons)
- `position_id` (UUID, FK -> positions)
- `is_primary` (BOOLEAN)
- `start_date` (DATE)
- `end_date` (DATE) - NULL means active

---

### 3. Roles & Permissions (Access Control)

**`roles`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations) - NULL = System wide
- `name` (TEXT)

**`permissions`**
- `id` (UUID, PK)
- `name` (TEXT, UNIQUE) - e.g., 'approve_leaves'
- `description` (TEXT)

**`role_permissions`**
- Links Roles to Permissions

**`person_roles`**
- Links Persons to Roles

---

### 4. Attendance Module
**`attendance`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `person_id` (UUID, FK -> persons)
- `work_date` (DATE)
- `check_in_at` (TIMESTAMPTZ)
- `check_out_at` (TIMESTAMPTZ)
- `status` (TEXT)
- `total_hours` (NUMERIC)

**`holidays`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `name` (TEXT)
- `date` (DATE)
- `type` (TEXT)
- `department_ids` (UUID ARRAY)

---

### 5. Leave Module
**`leave_types`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `name` (TEXT)
- `is_paid` (BOOLEAN)

**`leave_policies`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `leave_type_id` (UUID, FK -> leave_types)
- `accrual_type` (TEXT)
- `accrual_amount` (NUMERIC)
- `requires_approval` (BOOLEAN)

**`leave_balances`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `person_id` (UUID, FK -> persons)
- `leave_type_id` (UUID, FK -> leave_types)
- `year` (INTEGER)
- `total_days` (NUMERIC)
- `used_days` (NUMERIC)
- `pending_days` (NUMERIC)

**`leave_requests`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `person_id` (UUID, FK -> persons)
- `leave_type_id` (UUID, FK -> leave_types)
- `start_date` (DATE)
- `end_date` (DATE)
- `status` (TEXT)
- `actioned_by` (UUID, FK -> persons)

---

### 6. Salary & Payroll Module
**`salary_structures`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `position_id` (UUID, FK -> positions)
- `person_id` (UUID, FK -> persons)
- `base_salary` (NUMERIC)
- `currency` (TEXT)
- `effective_from` (DATE)
- `effective_to` (DATE)

**`payroll`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `person_id` (UUID, FK -> persons)
- `salary_structure_id` (UUID, FK -> salary_structures)
- `pay_period_start` (DATE)
- `pay_period_end` (DATE)
- `gross_salary` (NUMERIC)
- `net_salary` (NUMERIC)
- `status` (TEXT)

**`salary_deductions`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `payroll_id` (UUID, FK -> payroll)
- `name` (TEXT)
- `amount` (NUMERIC)
- `is_employer_contribution` (BOOLEAN)

---

### 7. Performance Module
**`performance_cycles`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `name` (TEXT)
- `start_date` (DATE)
- `end_date` (DATE)
- `status` (TEXT)

**`performance_goals`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `person_id` (UUID, FK -> persons)
- `cycle_id` (UUID, FK -> performance_cycles)
- `title` (TEXT)
- `description` (TEXT)
- `weightage` (NUMERIC)
- `status` (TEXT)

**`performance_reviews`**
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations)
- `person_id` (UUID, FK -> persons)
- `reviewer_id` (UUID, FK -> persons)
- `cycle_id` (UUID, FK -> performance_cycles)
- `rating` (NUMERIC)
- `feedback` (TEXT)
- `status` (TEXT)

---

## Clarifications Needed Before Migrating Rest of Schema

1. **Multi-positions:** Can one person hold multiple active positions simultaneously?
2. **Attendance Model:** Is attendance single-row per day (Present/Absent) or event-driven (Check In, Check Out, Break)?
3. **Multi-currency:** Will payroll need multi-currency support (`currency` column)?
4. **Permissions:** Are permissions dynamic rows or hardcoded system constants?
5. **Performance Module:** What entities make up the Performance module?
