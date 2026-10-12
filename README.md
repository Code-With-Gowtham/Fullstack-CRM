# Pulse CRM — AI-Powered Customer Intelligence

Pulse CRM is a customer relationship management (CRM) demo with a React web application and a FastAPI backend. The interface demonstrates a customer 360° workflow, sales lead management, support-oriented screens, and AI-inspired analytics.

The frontend can run independently with local mock data. When configured to use the backend, authentication and customer/lead records are served by a tenant-aware API backed by MySQL. Other analytics and workflow screens remain demo data; this is an MVP foundation, not a complete production SaaS.

## Contents

- [Features](#features)
- [How the application works](#how-the-application-works)
- [Technology](#technology)
- [Repository layout](#repository-layout)
- [Requirements](#requirements)
- [Clone and run the frontend](#clone-and-run-the-frontend)
- [Run the full application with MySQL](#run-the-full-application-with-mysql)
- [Configuration reference](#configuration-reference)
- [Demo accounts](#demo-accounts)
- [Backend API](#backend-api)
- [Data model and access control](#data-model-and-access-control)
- [Validation and tests](#validation-and-tests)
- [Troubleshooting](#troubleshooting)
- [Known limitations and production checklist](#known-limitations-and-production-checklist)

## Features

### CRM pages

- **Dashboard:** KPI cards, revenue trends, churn distribution, recommendations, sentiment, and follow-up information.
- **Customers:** searchable/filterable customer list and customer detail (Customer 360°) information, including profile data, churn/sentiment values, interaction-related mock content, and recommendations.
- **Leads:** lead list, lead details, lead scoring, status, and temperature.
- **Sales pipeline:** visual lead funnel by stage.
- **WhatsApp inbox and support tickets:** interface demonstrations populated from mock data.
- **AI Insights, Next-Best-Action, Churn Analytics, and Reports:** charts and recommendations driven by demo data.
- **Notifications, User Management, and Settings:** administrative and product-interface demonstrations.
- **Authentication:** login and workspace registration. The UI also includes a forgot-password screen, but password reset is not implemented by the API.

### Mock data and AI demonstrations

When `VITE_API_URL` is empty, the frontend uses deterministic local mock datasets and demo accounts. Demo AI-related features are rule-based or pre-written examples: they are not connected to a machine-learning model, an LLM, a WhatsApp service, or another external AI provider.

## How the application works

The project contains two applications:

1. **Frontend (`frontend/`)** — React runs in the browser and provides the CRM pages. Its API client reads `VITE_API_URL` at build/dev-server startup. If the variable is set, it sends requests to `<VITE_API_URL>/api/v1` and attaches the stored bearer token to authenticated requests. If it is unset, the app uses mock data.
2. **Backend (`backend/`)** — FastAPI exposes JSON endpoints, Pydantic validates input and output, SQLAlchemy accesses the relational database, and Alembic manages schema migrations. The backend issues short-lived JWT bearer access tokens.

For a full local session, the browser talks to Vite (normally `http://localhost:5173`), and Vite's frontend code calls FastAPI (normally `http://127.0.0.1:8000`). The API CORS allowlist must include the exact frontend origin.

When running in backend mode, registration creates a workspace, its first administrator, and a token. Login returns a token and user profile. Customer and lead records are stored in the API's database and scoped to the token's workspace. The current frontend does not switch to database-backed data for every screen: dashboards, reports, tickets, WhatsApp conversations, notifications, settings, and AI insights still display mock/demo content.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router, Tailwind CSS |
| Charts and icons | Recharts, Lucide React |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy |
| Database and migrations | MySQL with PyMySQL, Alembic |
| Authentication | JWT bearer access tokens, Argon2 password hashing through `pwdlib` |
| Backend test database | In-memory SQLite with pytest |

## Repository layout

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/       Shared layout and UI components
│   │   ├── context/          Authentication context/provider
│   │   ├── lib/              API client and helpers
│   │   ├── mock/             Demo CRM datasets
│   │   ├── pages/            CRM and authentication screens
│   │   └── types/            Shared TypeScript domain types
│   ├── .env.example          Frontend environment template
│   ├── package.json          Frontend dependencies and scripts
│   └── vite.config.ts        Vite configuration
├── backend/
│   ├── app/
│   │   ├── api/routes/       Authentication, customers, leads, users
│   │   ├── core/             Settings and security helpers
│   │   ├── db.py             SQLAlchemy engine and session dependency
│   │   ├── main.py           FastAPI app and CORS setup
│   │   ├── models.py         Organization, user, membership, customer, lead
│   │   └── schemas.py        Validated API request/response models
│   ├── migrations/           Alembic environment and schema revisions
│   ├── tests/                API integration tests
│   ├── .env.example          Backend environment template
│   ├── alembic.ini
│   └── requirements.txt
├── .gitignore
└── README.md                 Project, setup, API, and development guide
```

## Requirements

For frontend mock-data mode:

- Git
- Node.js with npm; use a currently supported Node.js LTS version

For the complete frontend/backend application:

- All frontend requirements above
- Python 3.11 or newer
- MySQL 8 or a compatible MySQL server

The backend test suite uses SQLite, so tests do not require a running MySQL server.

## Clone and run the frontend

Open PowerShell and clone the repository:

```powershell
git clone <repository-url>
cd CRM
```

Replace `<repository-url>` with the clone URL. If Git creates a folder with a different name, change into that directory.

Install and run the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`. In mock-data mode, use the role selector on the login screen and the demo password `demo1234`.

To stop the server, press `Ctrl+C` in its terminal.

## Run the full application with MySQL

Run the backend and frontend in **separate PowerShell terminals**. The commands below assume each terminal starts in the cloned repository root.

### 1. Create a database and app user

Start MySQL, connect as a database administrator, and run SQL similar to this:

```sql
CREATE DATABASE pulse_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pulsecrm'@'localhost' IDENTIFIED BY 'replace-with-a-unique-local-password';
GRANT ALL PRIVILEGES ON pulse_crm.* TO 'pulsecrm'@'localhost';
```

Use a unique local password. Do not add real credentials to source control.

### 2. Install and configure the backend

In the first PowerShell terminal:

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

If activation is blocked by your PowerShell execution policy, use the virtual environment executable directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Edit `backend/.env`. Set `DATABASE_URL` to the MySQL database/user you created and set a private JWT secret of at least 32 characters:

```dotenv
DATABASE_URL=mysql+pymysql://pulsecrm:replace-with-a-unique-local-password@127.0.0.1:3306/pulse_crm?charset=utf8mb4
JWT_SECRET=replace-with-a-private-random-secret-of-at-least-32-characters
JWT_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Generate a random JWT secret from the `backend` directory:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

If the MySQL password contains URL-reserved characters such as `@`, `:`, `/`, or `#`, URL-encode those characters in `DATABASE_URL`. Keep `backend/.env` private and never commit it.

Apply the database schema and start the API:

```powershell
python -m alembic upgrade head
python -m uvicorn app.main:app --reload
```

Keep this terminal open. The API is at `http://127.0.0.1:8000`; interactive Swagger documentation is at `http://127.0.0.1:8000/docs`. The health check is `http://127.0.0.1:8000/api/v1/health`.

### 3. Configure and start the frontend

In a second PowerShell terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
```

Set `frontend/.env.local` to:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

Then run:

```powershell
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`. Vite reads environment values when it starts; restart Vite after changing `.env.local`.

In backend mode, create an account through the registration page. The mock demo accounts listed below are not seeded into MySQL.

## Configuration reference

### Backend: `backend/.env`

| Variable | Purpose | Example/default |
| --- | --- | --- |
| `DATABASE_URL` | SQLAlchemy connection URL for the backend database | `mysql+pymysql://user:password@127.0.0.1:3306/pulse_crm?charset=utf8mb4` |
| `JWT_SECRET` | Secret used to sign and validate access tokens; at least 32 characters | Generate a private random value |
| `JWT_EXPIRE_MINUTES` | Access-token lifetime in minutes | `30` |
| `CORS_ORIGINS` | Comma-separated browser origins allowed to call the API | `http://localhost:5173,http://127.0.0.1:5173` |

### Frontend: `frontend/.env.local`

| Variable | Purpose | Example |
| --- | --- | --- |
| `VITE_API_URL` | API origin; leave unset/empty to use mock data | `http://127.0.0.1:8000` |

Do not put secrets in frontend variables: Vite variables are bundled for use in the browser and are not private.

## Demo accounts

These demo accounts are available only when `VITE_API_URL` is not configured:

| Email | Role | Access areas |
| --- | --- | --- |
| `gowtham@pulsecrm.com` | Administrator | All demo pages |
| `ram@pulsecrm.com` | Sales Manager | Sales, reports, support tickets, and shared CRM pages |
| `raja@pulsecrm.com` | Sales Executive | Sales and shared CRM pages; no reports, tickets, or user management |
| `anjali@pulsecrm.com` | Support Agent | Customers, WhatsApp, support tickets, AI insights, and shared CRM pages |

Demo password for each account: `demo1234`.

In backend mode, register a workspace and user instead. The first user in a new workspace receives the administrator role.

## Backend API

All routes are prefixed with `/api/v1`. Authenticated routes require this HTTP header:

```http
Authorization: Bearer <access-token>
```

| Method | Endpoint | Authentication/role | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | None | Check API and database connection |
| `POST` | `/auth/register` | Public | Create an organization, initial admin, and access token |
| `POST` | `/auth/login` | Public | Validate credentials and issue access token |
| `GET` | `/auth/me` | Authenticated | Return the current user and workspace |
| `GET` | `/customers` | Authenticated | List customers in the active workspace |
| `POST` | `/customers` | Authenticated | Create a customer in the active workspace |
| `GET` | `/customers/{id}` | Authenticated | Read a customer in the active workspace |
| `PATCH` | `/customers/{id}` | Authenticated | Update a customer in the active workspace |
| `DELETE` | `/customers/{id}` | Authenticated | Delete a customer in the active workspace |
| `GET` | `/leads` | Admin, manager, sales | List leads in the active workspace |
| `POST` | `/leads` | Admin, manager, sales | Create a lead in the active workspace |
| `GET` | `/leads/{id}` | Admin, manager, sales | Read a lead in the active workspace |
| `PATCH` | `/leads/{id}` | Admin, manager, sales | Update a lead in the active workspace |
| `DELETE` | `/leads/{id}` | Admin, manager, sales | Delete a lead in the active workspace |
| `GET` | `/users` | Admin | List workspace members |
| `GET` | `/users/{id}` | Admin | Read a workspace member |
| `PATCH` | `/users/{id}` | Admin | Change a workspace member's role or active state |

Registration requires name, email, password (at least 12 characters), and organization name. API request schemas validate field types, lengths, and domain values; duplicate workspace-local customer/lead emails return a conflict response.

## Data model and access control

The SQLAlchemy models are:

- **Organization:** a workspace/tenant.
- **User:** a globally unique email and password hash for an account.
- **Membership:** the user's role and active state in an organization.
- **Customer:** customer profile and CRM summary fields associated with an organization.
- **Lead:** sales lead details associated with an organization.

Roles supported by the API are `admin`, `manager`, `sales`, and `support`. Every authenticated request resolves its user and active membership from a signed JWT and the database. Customer/lead queries use the authenticated organization ID rather than accepting a tenant ID from the request. A user from a different workspace cannot access another workspace's customer or lead by guessing its record ID. Lead endpoints are restricted to admin, manager, and sales roles; user-management endpoints are restricted to admins.

Customer and lead email addresses are unique within each workspace. User email addresses are globally unique. Passwords are stored as hashes, never in plaintext.

## Validation and tests

Run the backend API integration tests from the repository root:

```powershell
cd backend
python -m pytest -q
```

The test setup overrides database access with an in-memory SQLite database and covers API health, registration/login, authentication failures, tenant isolation, customer/lead CRUD, role authorization, member management, and frontend-origin CORS.

Run the frontend TypeScript check and production build:

```powershell
cd frontend
npm run build
```

The generated frontend bundle is written to `frontend/dist/`.

## Troubleshooting

- **Frontend cannot connect to the API:** Confirm the backend is running, `VITE_API_URL` in `frontend/.env.local` is correct, and Vite was restarted after editing it.
- **Browser reports a CORS error:** Add the exact frontend origin (including scheme, host, and port) to `CORS_ORIGINS` in `backend/.env`, then restart FastAPI.
- **MySQL connection fails:** Check that MySQL is running, the database and app user exist, and the URL uses the right host, port, username, password, and database name.
- **Tables are missing:** From `backend/`, activate the backend virtual environment and run `python -m alembic upgrade head`.
- **Port is already in use:** Stop the other service or configure another port. If changing the Vite port, also add its origin to `CORS_ORIGINS`.
- **Python/npm commands are not found:** Install Python/Node.js and ensure their executables are on `PATH`. Run Python/Alembic/Uvicorn commands from `backend/` and npm commands from `frontend/`.
- **PowerShell blocks venv activation:** Use the `.venv\Scripts\python.exe` executable directly or update the execution policy according to your environment's security requirements.

## Known limitations and production checklist

The project is currently an MVP/demo. In particular:

- Dashboard analytics, reports, tickets, conversations, notifications, settings, and AI insights are not backed by API endpoints and remain demo data.
- AI predictions, summaries, recommendations, and replies are illustrative mock behavior, not model inference.
- The forgot-password screen has no backend reset/email workflow.
- User management supports listing, reading, and changing role/active membership, but invitations and self-service onboarding into an existing workspace are not implemented.
- There is no billing, email verification, refresh-token rotation, rate limiting, audit logging, or production deployment/monitoring configuration.

Before production use, add and review the missing product/security controls, use managed secrets and HTTPS, set production CORS origins explicitly, configure database backups and migrations, and complete a security and operational review.
