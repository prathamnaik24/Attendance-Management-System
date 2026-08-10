# Development Conventions
# Attendance Management System

> This document defines the rules every contributor must follow.
> Consistency here prevents merge conflicts, confusion, and bugs before they start.

---

## 1. Naming Conventions

### Files & Folders

| Context | Pattern | Example |
|---------|---------|---------|
| React components | `PascalCase.jsx` | `AttendanceCard.jsx` |
| React pages | `PascalCase.jsx` | `EmployeeDashboard.jsx` |
| Hooks | `camelCase`, prefixed with `use` | `useAttendance.js` |
| Services (frontend) | `camelCase.js` | `attendanceService.js` |
| Utility files | `camelCase.js` | `formatDate.js` |
| Style files | `camelCase.css` | `global.css` |
| Backend routes | `camelCase.js` | `attendanceRoutes.js` |
| Backend controllers | `camelCase.js` | `attendanceController.js` |
| Backend services | `camelCase.js` | `attendanceService.js` |
| Backend middlewares | `camelCase.js` | `authMiddleware.js` |
| Migration files | `NNN_snake_case.js` | `001_create_companies.js` |
| Seed files | `snake_case.js` | `attendance_status.js` |
| Folders | `kebab-case` or `camelCase` (match existing) | `migration-config/` |
| Environment vars | `SCREAMING_SNAKE_CASE` | `JWT_ACCESS_SECRET` |

### Variables & Functions (JS/JSX)

| Context | Pattern | Example |
|---------|---------|---------|
| Variables | `camelCase` | `companyId`, `workDate` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_LOGIN_ATTEMPTS` |
| Functions | `camelCase` verb-first | `getAttendance()`, `validateToken()` |
| React components | `PascalCase` | `<AttendanceTable />` |
| Database columns (reference) | `snake_case` | `company_id`, `work_date` |

### Database

| Context | Pattern | Example |
|---------|---------|---------|
| Table names | `snake_case`, plural | `attendance_events` |
| Column names | `snake_case` | `person_id`, `created_at` |
| Index names | `idx_table_column` | `idx_attendance_person_id` |
| FK constraint names | `fk_table_referenced` | `fk_attendance_persons` |
| Migration files | `NNN_verb_subject.js` | `001_create_companies.js` |

---

## 2. Folder Layout

### Root

```
attendance-system/
├── frontend/           # React + Vite + Tailwind v3
├── backend/            # Node.js + Express REST API
├── database/           # Migrations, seeds, migration runner config
├── docs/               # Architecture docs, ER diagrams, references
├── docker/             # Dockerfiles for each service
├── scripts/            # Helper shell/node scripts (CI, setup, etc.)
├── .env.example        # Template — never commit real .env
├── .gitignore
├── docker-compose.yml  # Orchestrates all services locally
├── CONVENTIONS.md      # This file
└── README.md
```

### Frontend (`frontend/src/`)

```
src/
├── assets/             # Static images, icons, fonts
├── components/         # Shared, reusable UI components (no page-specific logic)
├── layouts/            # Page wrapper layouts (EmployeeLayout, AdminLayout, KioskLayout)
├── pages/
│   ├── employee/       # Employee-facing screens
│   ├── admin/          # HR/Admin dashboard screens
│   └── kiosk/          # Office kiosk display screens
├── routes/             # React Router config and route guards
├── services/           # Axios API call wrappers (one file per domain)
├── styles/             # global.css (resets, animations), index.css (Tailwind directives)
├── utils/              # Pure helper functions (date formatting, validators, etc.)
└── main.jsx            # App entry point
```

**Rules:**
- `components/` = stateless, reusable, no direct API calls
- `pages/` = page-level components; can import from `components/`, `services/`, `utils/`
- `services/` = all API calls live here; pages never call `axios` directly
- `layouts/` = shared wrapper structure (navbar, sidebar, etc.)

### Backend (`backend/src/`)

```
src/
├── config/             # DB pool, env validation, app-wide constants
├── controllers/        # Request handlers — parse req, call service, send res
├── middlewares/        # auth, error handler, rate limiter, tenant resolver
├── routes/             # Express Router definitions (one file per domain)
├── services/           # Business logic — controllers call services, never raw DB
├── db/                 # pg pool export, query helpers
├── utils/              # Pure helpers (token generation, date utils, etc.)
└── app.js              # Express app setup (no listen() here)
```

**Rules:**
- Controllers are thin — they only handle HTTP in/out, delegate all logic to services
- Services never import from `controllers/` or `routes/`
- Raw SQL queries only in `services/` or `db/` — never in controllers
- `app.js` configures middleware and mounts routes; `server.js` (root) calls `app.listen()`

### Database (`database/`)

```
database/
├── migrations/         # Versioned migration files — all schema changes go here
├── seeds/              # Reference/lookup data seeds (run after migrations)
├── migration-config/   # node-pg-migrate config
└── README.md           # How to run migrations and seeds
```

---

## 3. Commit Message Style

Follow **Conventional Commits** — `type(scope): short description`

### Format

```
type(scope): short imperative description

[optional body — explain WHY, not WHAT]

[optional footer — breaking changes, closes #issue]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature or endpoint |
| `fix` | Bug fix |
| `chore` | Tooling, config, dependencies (no production code change) |
| `docs` | Documentation only |
| `style` | Formatting, whitespace, missing semicolons — no logic change |
| `refactor` | Code restructure with no feature/fix |
| `test` | Adding or fixing tests |
| `db` | Migration or seed files |
| `ci` | CI/CD pipeline changes |

### Scopes

| Scope | Applies to |
|-------|-----------|
| `frontend` | Anything in `frontend/` |
| `backend` | Anything in `backend/` |
| `db` | Anything in `database/` |
| `docker` | Docker or docker-compose changes |
| `config` | Root config, env, scripts |
| `docs` | Documentation files |

### Examples

```
feat(backend): add health check endpoint
fix(frontend): resolve QR scanner crash on iOS Safari
chore(config): add eslint and prettier config
db: add 001_create_companies migration
docs: update README with setup instructions
refactor(backend): extract token logic into utils/token.js
```

### Rules

- Use **imperative mood** — "add", not "added" or "adds"
- Keep the first line **under 72 characters**
- Do **not** end the subject line with a period
- One logical change per commit — don't bundle unrelated changes

---

## 4. Migration Rules

These rules are **non-negotiable**. The database is the source of truth.

### The Golden Rules

1. **Every database change goes through a migration file** — no exceptions, no direct SQL on the database
2. **Migrations are append-only** — never edit a migration file that has already been committed
3. **No destructive operations** — `DROP TABLE`, `DROP COLUMN`, and `TRUNCATE` are forbidden in migrations
4. **Soft deletes over hard deletes** — use `is_active = false` or a `deleted_at` timestamp instead of `DELETE`
5. **Migrations must be reversible** — every migration must have both an `up` and a `down` function

### File Naming

```
NNN_verb_subject.js
```

- `NNN` — zero-padded sequential number starting at `001`
- `verb` — what the migration does: `create`, `add`, `alter`, `rename`, `drop_index`
- `subject` — the table or concept being changed

```
001_create_companies.js
002_create_roles_and_departments.js
003_add_is_active_to_offices.js
004_create_attendance_index.js
```

### Migration File Structure

```js
// database/migrations/001_create_companies.js

exports.up = (pgm) => {
  pgm.createTable('companies', {
    id: { type: 'bigserial', primaryKey: true },
    name: { type: 'text', notNull: true },
    // ...
  });
};

exports.down = (pgm) => {
  pgm.dropTable('companies');
};
```

### Allowed Operations in Migrations

| Allowed | Not Allowed |
|---------|-------------|
| `CREATE TABLE` | `DROP TABLE` |
| `ALTER TABLE ADD COLUMN` | `DROP COLUMN` |
| `ALTER TABLE RENAME COLUMN` | `TRUNCATE` |
| `CREATE INDEX` | Direct `DELETE FROM` |
| `DROP INDEX` | Editing a committed migration |
| `CREATE UNIQUE INDEX` | |
| `ALTER TABLE ADD CONSTRAINT` | |

### Running Migrations

```bash
# Apply all pending migrations
npm run db:migrate

# Roll back the last migration (development only)
npm run db:migrate:down

# Create a new migration file
npm run db:create-migration -- name-of-migration
```

---

## 5. Branch Strategy

```
master   ← always stable and deployable
  └── dev  ← integration branch for active development
        ├── feature/frontend-scaffold
        ├── feature/backend-scaffold
        └── feature/db-migration-setup
```

### Rules

- All work happens on **feature branches** cut from `dev`
- Feature branches merge back into `dev` via Pull Request
- `dev` merges into `master` only at stable milestones (end of week, working feature set)
- Branch names: `feature/short-description`, `fix/short-description`, `chore/short-description`
- Delete feature branches after merging

---

## 6. Environment Variables

- `.env.example` is always up to date — if you add a new env var, add it here too
- Never commit a real `.env` file — it is listed in `.gitignore`
- All env vars must be validated/read through `backend/src/config/env.js` — no bare `process.env` scattered through the codebase

---

*Last updated: August 2026 — v1*
