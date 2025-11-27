# HRMS Management System

All-in-one Human Resource Management System that streamlines employee onboarding, attendance & leave tracking, payroll documents, announcements, and scheduling. The repository is a monorepo with an Express/Sequelize API (`backend/`), a React dashboard (`frontend/`), and production-ready Docker + Nginx manifests (`nginx/`).

## Highlights

- Role-aware portals for admins and employees (authentication guards & JWT sessions).
- Attendance, leave, announcements, payslips, work schedules, and document management backed by MySQL migrations.
- File handling via AWS S3 (uploads + signed downloads) with fallbacks to local storage in development.
- Transactional email (SendGrid) for password resets and onboarding invitations.
- Comprehensive test harness: Mocha/Chai for backend unit & integration tests, React Testing Library + Cypress E2E on the frontend.
- Containerized deployment path with separate backend, frontend, and Nginx reverse proxy stacks.

## Repository Layout

```
.
├── backend/        # Express API, Sequelize models/migrations, Jest-style tests
├── frontend/       # React app (create-react-app) with auth context & dashboards
├── nginx/          # Reverse proxy & TLS automation assets
└── uploads/        # Local file artifacts (ignored in production thanks to S3)
```

## Tech Stack

- **Backend:** Node 18+, Express, Sequelize, MySQL 8, Multer, AWS SDK, SendGrid.
- **Frontend:** React 18, React Router, Redux Toolkit, Bootstrap/MUI, Axios.
- **Tooling:** Nodemon, ESLint/Prettier, Mocha/Chai/Sinon, React Testing Library, Cypress, Docker, Nginx, Certbot.

## Prerequisites

- Node.js 18+ and npm 9+ (or compatible versions from nvm).
- MySQL 8 (or Docker to run the bundled database service).
- AWS S3 bucket & credentials (only required for production-grade file storage).
- SendGrid API key (or disable email flows locally).
- Docker 24+ / Docker Compose v2 for containerized workflows.

## Local Development

Clone the project and install dependencies per workspace:

```bash
git clone <repo-url> HRMS-Management-System
cd HRMS-Management-System
```

### 1. Backend API

```bash
cd backend
npm install
# create backend/.env using the template below
npm run migrate        # applies Sequelize migrations
npm run dev            # starts on http://localhost:8000
```

> The API enables CORS for the URLs listed in `FRONTEND_URL`. Update your `.env` when the frontend runs on a different host/port.

### 2. Frontend Dashboard

```bash
cd frontend
npm install
# create frontend/.env (see variables below)
npm start              # CRA dev server on http://localhost:3000
```

Set `REACT_APP_BACKEND_URL` so Axios points at the running backend API.

### 3. Running both services

- Start the backend first (port `8000` by default).
- Start the frontend (port `3000` by default).
- Sign in using seeded admin credentials or create users via the admin UI once the database is populated.

## Environment Variables

### Backend (`backend/.env`)

```dotenv
NODE_ENV=development
PORT=8000

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=hrms_db
DB_USER=hrms_user
DB_PASSWORD=super-secret
DB_DIALECT=mysql

# Auth & URLs
JWT_SECRET=change-me
FRONTEND_URL=http://localhost:3000
DOMAIN=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=no-reply@example.com
EMAIL_FROM_NAME=HRMS Platform

# AWS / S3 (production)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=hrms-storage
```

### Frontend (`frontend/.env`)

```dotenv
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_FRONTEND_URL=http://localhost:3000
```

> CRA only exposes variables prefixed with `REACT_APP_`. Restart the dev server after editing.

## Database & Migrations

- Sequelize migrations live in `backend/migrations/`.
- Apply migrations: `npm run migrate`.
- Undo last migration: `npm run migrate:undo`.
- Reset all: `npm run migrate:undo:all`.
- Production-safe wrapper (checks pending migrations before applying): `npm run migrate:safe`.
- For CI/production, `scripts/run-production-migration.sh` encapsulates the workflow.

## Testing

### Backend

- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`
- Full suite: `npm test`
- With disposable Docker MySQL: `npm run test:with-db` (brings up `docker-compose.test.yml`)
- Coverage: `npm run test:coverage`
- Linting/formatting: `npm run lint`, `npm run lint:fix`, `npm run lint:format`

### Frontend

- Component tests: `npm test`
- Coverage build: `npm run test:unit`
- Cypress E2E (headless): `npm run test:e2e`
- Cypress UI runner: `npm run test:e2e:open`
- Lint/format: `npm run lint`, `npm run lint:fix`, `npm run lint:format`, `npm run format`

## File Storage & Emails

- Upload middleware targets AWS S3 when `AWS_*` vars are set. During local development the app keeps files under `backend/uploads/` for inspection.
- Password resets and onboarding emails are rendered via SendGrid templates in `backend/service/emailService.js`. Provide `SENDGRID_API_KEY` plus branding fields to customize the sender.

## Dockerized Deployment

1. Build images:
   ```bash
   cd backend && docker build -t hrms-backend .
   cd ../frontend && docker build -t hrms-frontend .
   ```
2. Create the shared network once:
   ```bash
   docker network create hrms-network
   ```
3. Start services:
   ```bash
   # backend + database
   cd backend && docker compose up -d
   # frontend (served via nginx or expose port 3000 if debugging)
   cd ../frontend && docker compose up -d
   # nginx reverse proxy + certbot (optional TLS layer)
   cd ../nginx && docker compose up -d
   ```
4. Populate `.env` files before running `docker compose`. The backend compose file mounts `./uploads` and waits for `mysql` before booting.

## Nginx & TLS

- `nginx/nginx.conf` routes public traffic to the frontend container, proxies API calls to the backend, and exposes ACME challenges.
- `nginx/docker-compose.yml` also wires in Certbot so certificates can be issued/renewed. Mount your certificates via `./certbot/conf` & `./certbot/www`.

## Useful npm Scripts

| Location | Script                 | Purpose                             |
| -------- | ---------------------- | ----------------------------------- |
| backend  | `npm run prod`         | Start API with Node (no hot reload) |
| backend  | `npm run deploy`       | Build + start API                   |
| backend  | `npm run migrate:safe` | Guarded migration runner            |
| frontend | `npm run build`        | Production React build              |
| frontend | `npm run start`        | Run CRA dev server                  |

## Troubleshooting

- **Port already in use:** change `PORT`/`REACT_APP_BACKEND_URL` or stop conflicting processes.
- **MySQL auth errors:** confirm credentials in `.env` match the running MySQL instance (or Docker service).
- **S3 upload failures:** ensure your IAM user has `s3:PutObject`, `s3:GetObject`, and `s3:DeleteObject` for the bucket.
- **CORS blocked:** verify `FRONTEND_URL` (comma-separated list) includes the exact origin (scheme + host + port).

## Contributing

1. Fork and create a feature branch.
2. Add/adjust tests alongside code changes.
3. Run linters & test suites for the touched workspace.
4. Open a PR describing user-facing changes, new migrations, and any env var additions.

---

Questions or ideas? Open an issue or reach out to the maintainers. Happy building!
