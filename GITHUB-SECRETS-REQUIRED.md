# GitHub Secrets Required for CI/CD Pipelines

## 🔴 **NEW SECRET REQUIRED** (After GHCR Implementation)

### `GHCR_PAT` ⭐ **REQUIRED**
- **Purpose**: Personal Access Token for pulling Docker images from GitHub Container Registry (GHCR) on the server
- **How to create**:
  1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Click "Generate new token (classic)"
  3. Name: `GHCR-PAT-HRMS`
  4. Select scopes: `read:packages` (minimum required)
  5. Generate token and copy it
- **Where to add**: Repository Settings → Secrets and variables → Actions → **Production** environment
- **Note**: This is the **only new secret** you need to add after implementing GHCR

---

## ✅ **Existing Secrets** (You should already have these)

### **Digital Ocean Deployment**
- `DO_HOST` - Your Digital Ocean droplet IP address or hostname
- `DO_USERNAME` - SSH username (usually `root` or your user)
- `DO_SSH_KEY` - Private SSH key for accessing the droplet
- `DO_PORT` - SSH port (optional, defaults to 22)

### **Database Configuration**
- `DB_ROOT_PASSWORD` - MySQL root password
- `DB_NAME` - Database name (e.g., `hrms_db`)
- `DB_USER` - Database user (e.g., `hrms_user`)
- `DB_PASSWORD` - Database user password
- `DB_PORT` - Database port (optional, defaults to `3306`)
- `DB_DIALECT` - Database dialect (optional, defaults to `mysql`)

### **Security & Authentication**
- `JWT_SECRET` - Secret key for JWT token signing

### **Email Configuration (SendGrid)**
- `SENDGRID_API_KEY` - SendGrid API key for sending emails
- `EMAIL_FROM` - Sender email address (optional, defaults to `no-reply@kitor.io`)
- `EMAIL_FROM_NAME` - Sender name (optional, defaults to `Xylobit HRMS`)

### **URL Configuration**
- `FRONTEND_URL` - Frontend URL (e.g., `https://h-rms.me`)
- `DOMAIN` - Domain name (e.g., `h-rms.me`)
- `BACKEND_URL` - Backend API URL (e.g., `https://api.h-rms.me`)
- `REACT_APP_BACKEND_URL` - Backend URL for React app (e.g., `https://api.h-rms.me`)
- `REACT_APP_FRONTEND_URL` - Frontend URL for React app (e.g., `https://h-rms.me`)

### **AWS S3 Configuration**
- `AWS_ACCESS_KEY_ID` - AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `AWS_S3_BUCKET_NAME` - S3 bucket name for file storage

### **Optional: Code Quality Tools**
- `SNYK_TOKEN` - Snyk API token (optional, for security scanning)
- `SONAR_TOKEN` - SonarCloud token (optional, for code analysis)
- `SONAR_PROJECT_KEY` - SonarCloud project key (optional)
- `SONAR_ORGANIZATION` - SonarCloud organization (optional)

### **Optional: Health Check URLs**
- `DEPLOY_URL` - Backend health check URL (optional, for deployment verification)
- `FRONTEND_DEPLOY_URL` - Frontend health check URL (optional, for deployment verification)

---

## 📋 **Quick Setup Checklist**

### Step 1: Create GHCR Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `GHCR-PAT-HRMS`
4. Expiration: Choose appropriate (90 days recommended)
5. Scopes: Check `read:packages`
6. Click "Generate token"
7. **Copy the token immediately** (you won't see it again!)

### Step 2: Add to GitHub Secrets
1. Go to your repository: `https://github.com/{your-username}/HRMS-Management-System`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **Environments** → Select **Production**
4. Click **New secret**
5. Name: `GHCR_PAT`
6. Value: Paste your token
7. Click **Add secret**

### Step 3: Verify All Required Secrets
Use this checklist to verify you have all required secrets in the **Production** environment:

#### Required for Deployment:
- [ ] `GHCR_PAT` ⭐ **NEW**
- [ ] `DO_HOST`
- [ ] `DO_USERNAME`
- [ ] `DO_SSH_KEY`
- [ ] `DB_ROOT_PASSWORD`
- [ ] `DB_NAME`
- [ ] `DB_USER`
- [ ] `DB_PASSWORD`
- [ ] `JWT_SECRET`
- [ ] `SENDGRID_API_KEY`
- [ ] `FRONTEND_URL`
- [ ] `DOMAIN`
- [ ] `BACKEND_URL`
- [ ] `REACT_APP_BACKEND_URL`
- [ ] `REACT_APP_FRONTEND_URL`
- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_REGION`
- [ ] `AWS_S3_BUCKET_NAME`

#### Optional (but recommended):
- [ ] `SNYK_TOKEN`
- [ ] `SONAR_TOKEN`
- [ ] `SONAR_PROJECT_KEY`
- [ ] `SONAR_ORGANIZATION`
- [ ] `DEPLOY_URL`
- [ ] `FRONTEND_DEPLOY_URL`

---

## 🔍 **How to Check Your Secrets**

1. Go to: `https://github.com/{your-username}/HRMS-Management-System/settings/secrets/actions`
2. Click on **Environments** → **Production**
3. You'll see all secrets for that environment

---

## ⚠️ **Important Notes**

1. **Environment**: Make sure all secrets are added to the **Production** environment, not repository-level secrets
2. **GHCR_PAT**: This is the only new secret required after implementing GHCR
3. **Token Expiration**: Remember to renew `GHCR_PAT` before it expires
4. **Security**: Never commit secrets to the repository
5. **Fallback**: If `GHCR_PAT` is not set, the pipeline will try to use `GITHUB_TOKEN`, but this may not work for private packages

---

## 🆘 **Troubleshooting**

### Issue: "Failed to pull image from GHCR"
**Solution**: 
- Verify `GHCR_PAT` is set in Production environment
- Check token has `read:packages` permission
- Verify token hasn't expired
- Check package visibility (private packages require authentication)

### Issue: "Authentication failed"
**Solution**:
- Regenerate `GHCR_PAT` token
- Ensure token has correct permissions
- Verify token is in the correct environment (Production)

