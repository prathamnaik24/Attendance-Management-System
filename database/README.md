# Database

This directory contains all database-related files for the Attendance Management System.

## Structure

```
database/
├── migrations/          # Versioned schema migration files
├── seeds/               # Reference and lookup data seeds
├── migration-config/    # node-pg-migrate configuration
└── README.md            # This file
```

---

## Migration Rules (Read Before Touching Anything)

1. **All schema changes go through a migration file** — no direct SQL on the database ever
2. **Never edit a migration that has already been committed and run**
3. **No destructive queries** — `DROP TABLE`, `DROP COLUMN`, and `TRUNCATE` are not allowed
4. **Every migration must have both `up` and `down` functions**
5. **Soft deletes only** — use `is_active` or `deleted_at` instead of deleting rows

---

## Commands

Run from the **project root**:

```bash
# Apply all pending migrations
npm run db:migrate

# Roll back the last migration (dev only)
npm run db:migrate:down

# Create a new blank migration file
npm run db:create-migration -- 002_create_roles
```

---

## Migration File Naming

```
NNN_verb_subject.js
```

Examples:
```
001_create_companies.js
002_create_roles_and_departments.js
003_add_is_active_to_offices.js
```

---

## Status

- Migrations folder is **empty** — schema will be added after the structure brief is confirmed
- Seeds folder is **empty** — lookup table data (attendance_status, verification_methods, anomaly_types) will be seeded after schema is ready
