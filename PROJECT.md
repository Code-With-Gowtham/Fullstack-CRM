# Pulse CRM — Setup and Development Guide

This guide explains how to run the project from a fresh clone on Windows using PowerShell. The repository has two independent applications:

- `frontend/`: React, TypeScript, and Vite.
- `backend/`: FastAPI, SQLAlchemy, and Alembic.

You can run the frontend without the backend in mock-data mode. To persist authentication, customers, and leads, run both applications and connect the frontend to the API.

## Requirements

- Git
- Node.js with npm (use a currently supported Node.js LTS release; npm is included with Node.js)
- Python 3.11 or newer
- MySQL 8 or compatible, for backend development

The backend API tests use SQLite and do not need a running MySQL server.

## Clone the repository

Open PowerShell and clone the repository:

```powershell
git clone <repository-url>
cd CRM
```

Replace `<repository-url>` with the repository's clone URL. If Git creates a folder with a different name, change into that folder.

## Option A: Run the frontend only

This starts the app with the built-in deterministic mock data. Python and MySQL are not needed.

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. In mock-data mode, use the role selector on the login page. The demo password for the accounts in [README.md](./README.md) is `demo1234`.

To stop the development server, press `Ctrl+C` in its terminal.

## Option B: Run the frontend and backend

Run the backend and frontend in separate PowerShell terminals. Keep both terminals open while developing.

### 1. Create a MySQL database

Start MySQL and connect using an administrative account. Run SQL similar to:

```sql
CREATE DATABASE pulse_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pulsecrm'@'localhost' IDENTIFIED BY 'replace-with-a-unique-password';
GRANT ALL PRIVILEGES ON pulse_crm.* TO 'pulsecrm'@'localhost';
```

Use a unique local password. Do not commit real database credentials.

### 2. Configure and start the backend

In the first PowerShell terminal, from the repository root:

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

If PowerShell prevents virtual-environment activation, either allow activation for the current user according to your machine's policy, or use the virtual environment's executables directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Edit `backend/.env` and set the database URL and a private JWT signing secret:

```dotenv
DATABASE_URL=mysql+pymysql://pulsecrm:replace-with-a-unique-password@127.0.0.1:3306/pulse_crm?charset=utf8mb4
JWT_SECRET=replace-with-at-least-32-random-characters
JWT_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

If the database password contains URL-reserved characters (for example `@`, `:`, `/`, or `#`), URL-encode those characters in `DATABASE_URL`. Keep `.env` private; it is for local use and must not be committed.

Generate a suitable JWT secret from the `backend` directory with:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Apply database migrations and launch the API:

```powershell
python -m alembic upgrade head
python -m uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Interactive API documentation is at `http://127.0.0.1:8000/docs`; the health endpoint is `http://127.0.0.1:8000/api/v1/health`.

### 3. Configure and start the frontend

Open a second PowerShell terminal at the repository root:

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
```

Confirm `frontend/.env.local` contains:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

Start Vite:

```powershell
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. Vite reads `VITE_API_URL` at startup; restart its server after changing the value.

Register a new workspace and administrator through the app. The mock demo accounts are not present in the database. With the backend enabled, authentication and customer/lead records use the API; other areas noted in [README.md](./README.md) continue to display demo data.

## Backend API

All endpoints are prefixed with `/api/v1`. Authenticated endpoints require `Authorization: Bearer <access-token>`.

| Method | Endpoint | Access and purpose |
| --- | --- | --- |
| `GET` | `/health` | Database connectivity health check |
| `POST` | `/auth/register` | Create a workspace, its first administrator, and an access token |
| `POST` | `/auth/login` | Authenticate and return an access token |
| `GET` | `/auth/me` | Return the current user and workspace |
| `GET`, `POST` | `/customers` | List or create customers in the current workspace |
| `GET`, `PATCH`, `DELETE` | `/customers/{id}` | Read, update, or delete a workspace customer |
| `GET`, `POST` | `/leads` | List or create leads (admin, manager, or sales role) |
| `GET`, `PATCH`, `DELETE` | `/leads/{id}` | Read, update, or delete a lead (admin, manager, or sales role) |
| `GET` | `/users` | List workspace users (admin only) |
| `GET` | `/users/{id}` | Read a workspace user (admin only) |
| `PATCH` | `/users/{id}` | Update a workspace user's role or active membership (admin only) |

Customer and lead access is scoped to the authenticated user's workspace. Lead access is additionally restricted by role.

## Run checks

### Backend tests

From the repository root:

```powershell
cd backend
python -m pytest -q
```

The test configuration uses an in-memory SQLite database, so these tests do not modify the MySQL database.

### Frontend production build and TypeScript check

From the repository root:

```powershell
cd frontend
npm run build
```

## Common issues

- **Frontend cannot reach the API:** Make sure the backend is running, `VITE_API_URL` in `frontend/.env.local` is correct, and Vite was restarted after changing it.
- **CORS error in the browser:** Make sure the frontend origin (normally `http://localhost:5173`) is included in `CORS_ORIGINS` in `backend/.env`, then restart the API.
- **Backend cannot connect to MySQL:** Check that MySQL is running, the database and user exist, and the `DATABASE_URL` credentials and port are correct.
- **Database tables are missing:** Run `python -m alembic upgrade head` from the `backend` directory after configuring its environment.
- **A port is already in use:** Stop the existing process or configure a different server port; if you change the frontend port, add its exact origin to `CORS_ORIGINS`.
- **Commands are not found:** Confirm the relevant directory is active (`frontend` for npm; `backend` for Python/Alembic/Uvicorn) and install that application's dependencies.

## Current scope

This is an MVP foundation, not a production-ready hosted SaaS. Invitations, billing, password reset and email verification, refresh-token rotation, rate limiting, audit logging, production deployment, and operational monitoring are not implemented. Several dashboard and analytics pages remain demo-only even when the API is enabled.
