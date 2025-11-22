# Environment Variables Reference

This document lists all environment variables required for the HRMS Management System.

## Required GitHub Secrets

Add these secrets in your GitHub repository: **Settings → Secrets and variables → Actions**

### Database Configuration

- `DB_ROOT_PASSWORD` - MySQL root password
- `DB_NAME` - Database name (e.g., `hrms_db`)
- `DB_USER` - Database user (e.g., `hrms_user`)
- `DB_PASSWORD` - Database password
- `DB_PORT` - Database port (default: `3306`, optional)
- `DB_DIALECT` - Database dialect (default: `mysql`, optional)

### Security & Authentication

- `JWT_SECRET` - Secret key for JWT token signing

### Email Configuration (SendGrid)

- `SENDGRID_API_KEY` - SendGrid API key (starts with `SG.`)
- `EMAIL_FROM` - Sender email address (default: `no-reply@kitor.io`, optional)
- `EMAIL_FROM_NAME` - Sender name (default: `Xylobit HRMS`, optional)

### URL Configuration

- `FRONTEND_URL` - Frontend application URL (e.g., `https://hrms.example.com`)
- `DOMAIN` - Primary domain (e.g., `https://hrms.example.com`)
- `BACKEND_URL` - Backend API URL (e.g., `https://api.hrms.example.com`)

### Frontend Environment Variables (React)

- `REACT_APP_BACKEND_URL` - Backend API URL for React app
- `REACT_APP_FRONTEND_URL` - Frontend URL for React app

### AWS S3 Configuration (File Storage)

- `AWS_ACCESS_KEY_ID` - AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `AWS_REGION` - AWS region (default: `us-east-1`, optional)
- `AWS_S3_BUCKET_NAME` - S3 bucket name

### Deployment Configuration

- `DO_HOST` - Digital Ocean droplet IP address or hostname
- `DO_USERNAME` - SSH username for Digital Ocean droplet
- `DO_SSH_KEY` - SSH private key for Digital Ocean droplet
- `DO_PORT` - SSH port (default: `22`, optional)
- `DEPLOY_URL` - Backend deployment URL for health checks
- `FRONTEND_DEPLOY_URL` - Frontend deployment URL for health checks

### Optional (CI/CD Tools)

- `SNYK_TOKEN` - Snyk security scanning token (optional)
- `SONAR_TOKEN` - SonarCloud analysis token (optional)

---

## Environment Variables by File

### `backend/docker-compose.yml`

Used by: Production Docker containers

```yaml
# Application
NODE_ENV=production
PORT=8000

# Database
DB_HOST=mysql
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT=3306
DB_DIALECT=mysql

# Security
JWT_SECRET

# Email (SendGrid)
SENDGRID_API_KEY
EMAIL_FROM
EMAIL_FROM_NAME

# URLs
FRONTEND_URL
DOMAIN
BACKEND_URL

# AWS S3
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET_NAME
```

### `frontend/docker-compose.yml`

Used by: Frontend Docker container

```yaml
# React Environment Variables
REACT_APP_BACKEND_URL
REACT_APP_FRONTEND_URL
```

### `.github/workflows/backend-pipeline.yml`

Used by: CI/CD pipeline for backend

All secrets listed above are used in the deployment step to create the `.env` file on the server.

### `.github/workflows/frontend-pipeline.yml`

Used by: CI/CD pipeline for frontend

All secrets listed above are used in the deployment step to create the `.env` file on the server.

---

## Local Development

For local development, create a `.env` file in the `backend/` directory:

```env
# Application Configuration
NODE_ENV=development
PORT=8000

# Database Configuration
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hrms_db
DB_PORT=3306
DB_DIALECT=mysql

# Security & Authentication
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
EMAIL_FROM=no-reply@kitor.io
EMAIL_FROM_NAME=Xylobit HRMS

# URL Configuration
FRONTEND_URL=http://localhost:3000
DOMAIN=http://localhost:3000
BACKEND_URL=http://localhost:8000

# AWS S3 Configuration (Optional - falls back to local storage if not set)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name
```

---

## Notes

1. **Sensitive Data**: Never commit `.env` files to version control
2. **Defaults**: Variables marked as "optional" have default values in the code
3. **AWS S3**: If AWS credentials are not provided, the system falls back to local file storage
4. **Email**: SendGrid API key is required for email functionality
5. **URLs**: Make sure `FRONTEND_URL`, `DOMAIN`, and `BACKEND_URL` are set correctly for production
