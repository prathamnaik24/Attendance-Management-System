# Attendance Management System

> **Internship Project** — Multi-tenant, event-driven employee attendance tracking system.
> 
> **Tech Stack:** PostgreSQL · Node.js + Express · React + Vite

---

## Overview

A web-based attendance management system that allows employees to mark attendance using a **rotating QR code** displayed at the office entrance, backed by device binding and geofencing for anti-spoofing. HR/admin staff get a live dashboard for real-time visibility, anomaly review, and historical reporting.

The system is designed as a **multi-tenant SaaS** — a single deployment can serve multiple independent companies with strict database-level data isolation via PostgreSQL Row-Level Security.

---

## Features

- **Rotating QR Check-in** — Office kiosk displays a short-lived (~15–30s) signed token; no forwarded screenshot can be reused
- **Device Binding** — Each employee is tied to one registered device; unrecognized devices are flagged
- **Geofencing** — GPS captured at check-in is validated against the office's coordinates as a secondary signal
- **Event-Driven Attendance** — Tracks `check_in`, `check_out`, `break_start`, `break_end` as individual events
- **Multi-Tenant Architecture** — Full tenant isolation via `company_id` columns + PostgreSQL RLS
- **Anomaly Review Queue** — Suspicious events are queued for admin review rather than silently blocked
- **Configurable Policies** — Per-office/department/shift verification requirements stored as data, not code
- **Audit Trail** — Every action logged with timestamp, IP, and device

---

## Project Structure

```
/
├── backend/          # Node.js + Express REST API
├── frontend/         # React + Vite (employee app + admin dashboard)
├── database/         # PostgreSQL schema migrations (node-pg-migrate)
├── docker/           # Dockerfiles for dev environment
├── docs/             # Architecture and design documentation
├── docker-compose.yml
├── package.json      # Root workspace scripts
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 15
- Docker & Docker Compose (recommended)

### 1. Clone the repository

```bash
git clone https://github.com/prathamnaik24/Attendance-Management-System.git
cd Attendance-Management-System
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run with Docker (Recommended)

```bash
# Start all services (Database, Backend, Frontend)
npm run docker:up:build

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

### 4. Run without Docker

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

---

## Database Schema

The schema is organized into logical domains. **We use the `ltree` extension** for high-performance deep organizational hierarchies.

| Domain | Tables |
|--------|--------|
| **Organization & Structure** | `organizations`, `departments`, `positions` (ltree hierarchy) |
| **People & Assignments** | `persons`, `position_assignments` |
| **Roles & Permissions** | `roles`, `permissions`, `role_permissions`, `person_roles` |
| **Attendance & Leaves** | `attendance`, `holidays`, `leave_types`, `leave_policies`, `leave_balances`, `leave_requests` |
| **Salary & Payroll** | `salary_structures`, `payroll`, `salary_deductions` |

> For full details, read [docs/database-design.md](./docs/database-design.md)
---

## API Endpoints (Key)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Login, issues JWT + registers device |
| `GET`  | `/api/kiosk/qr-stream` | Live rotating QR token for kiosk |
| `POST` | `/api/attendance/check-in` | Employee check-in with token + GPS |
| `POST` | `/api/attendance/check-out` | Check-out / break events |
| `GET`  | `/api/attendance/me` | Employee's own attendance history |
| `GET`  | `/api/admin/attendance/live` | Live dashboard feed |
| `GET`  | `/api/admin/attendance/reports` | Historical reports |
| `GET`  | `/api/admin/anomalies` | Anomaly review queue |
| `POST` | `/api/admin/anomalies/:id/decision` | Approve or reject flagged event |

---

## Security

- QR tokens are **HMAC-signed server-side** and single-use
- JWT access tokens are **short-lived (15 min)**; refresh tokens are **device-bound**
- **PostgreSQL Row-Level Security** enforces tenant isolation at the DB layer
- Passwords hashed with **bcrypt / Argon2**
- Rate limiting on all check-in endpoints

---

## Version History

| Version | Summary |
|---------|---------|
| 0.1 | Initial single-company schema, basic check-in/check-out |
| 2 | Multi-tenant redesign, lookup tables, event-driven attendance, RLS |
| 3 | Structured data dictionary, timezone handling, anomaly workflow |
| 4 | Final draft — schema finalized, documentation complete |

---

## License

This project was developed as an internship project. All rights reserved.
