# Reverse Proxy Setup for HRMS - Complete Step-by-Step Guide

This guide explains how to set up Nginx as a reverse proxy on your Digital Ocean droplet to handle SSL and route traffic to your Docker containers.

**Your Domain:** `h-rms.me`
- Frontend: `h-rms.me`
- Backend: `api.h-rms.me`

## Prerequisites

1. ✅ DNS records configured:
   - `h-rms.me` → A record → Your droplet IP
   - `api.h-rms.me` → A record → Your droplet IP
2. ✅ Digital Ocean droplet with Docker installed
3. ✅ SSH access to your droplet
4. ✅ Docker containers running (frontend on port 80, backend on port 8000)

---

## Step 1: Connect to Your Droplet

```bash
# SSH into your Digital Ocean droplet
ssh root@YOUR_DROPLET_IP
# Or if you use a username:
ssh YOUR_USERNAME@YOUR_DROPLET_IP
```

---

## Step 2: Install Nginx and Certbot

```bash
# Update package list
sudo apt update

# Install Nginx, Certbot, and Python plugin
sudo apt install nginx certbot python3-certbot-nginx -y

# Check Nginx version (verify installation)
nginx -v

# Check if Nginx is running
sudo systemctl status nginx
```

**Expected output:** Nginx should be active and running.

---

## Step 3: Configure Firewall (if not already done)

```bash
# Check firewall status
sudo ufw status

# If firewall is not enabled, allow required ports:
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable firewall (if not already enabled)
sudo ufw enable

# Verify
sudo ufw status
```

---

## Step 4: Create Nginx Configuration File

```bash
# Create the configuration file
sudo nano /etc/nginx/sites-available/hrms
```

**Copy and paste this entire configuration:**

```nginx
# Frontend Configuration - h-rms.me
server {
    listen 80;
    server_name h-rms.me www.h-rms.me;

    # Increase timeouts for large file uploads
    client_max_body_size 50M;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support (if needed)
        proxy_set_header Connection "upgrade";
    }
}

# Backend API Configuration - api.h-rms.me
server {
    listen 80;
    server_name api.h-rms.me;

    # Increase timeouts for large file uploads
    client_max_body_size 50M;
    proxy_read_timeout 300s;
    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support (if needed)
        proxy_set_header Connection "upgrade";
    }
}
```

**To save in nano:**
1. Press `Ctrl + O` (save)
2. Press `Enter` (confirm filename)
3. Press `Ctrl + X` (exit)

---

## Step 5: Enable the Site

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/hrms /etc/nginx/sites-enabled/

# Remove default Nginx site (optional but recommended)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration for syntax errors
sudo nginx -t
```

**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If you see errors:** Check the configuration file for typos.

```bash
# Reload Nginx to apply changes
sudo systemctl reload nginx

# Or restart Nginx
sudo systemctl restart nginx

# Check Nginx status
sudo systemctl status nginx
```

---

## Step 6: Verify Docker Containers Are Running

```bash
# Check if containers are running
docker ps

# You should see:
# - hrms-frontend (port 80)
# - hrms-backend (port 8000)
# - hrms-mysql

# Test backend health endpoint
curl http://localhost:8000/api/health

# Test frontend (should return HTML)
curl http://localhost:80
```

**If containers are not running:**
```bash
# Navigate to your project directory
cd /opt/hrms  # or wherever you deployed

# Start backend
cd backend
docker-compose up -d

# Start frontend
cd ../frontend
docker-compose up -d
```

---

## Step 7: Test HTTP Access (Before SSL)

```bash
# Test frontend (from your local machine or droplet)
curl -I http://h-rms.me

# Test backend
curl http://api.h-rms.me/api/health
```

**Expected:** You should get responses from both domains.

**If you get connection errors:**
- Check DNS propagation: `dig h-rms.me` (should show your droplet IP)
- Verify containers are running: `docker ps`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

---

## Step 8: Set Up SSL with Let's Encrypt

```bash
# Get SSL certificates for both domains
sudo certbot --nginx -d h-rms.me -d www.h-rms.me -d api.h-rms.me
```

**Certbot will ask you:**
1. **Email address:** Enter your email (for renewal notifications)
2. **Terms of Service:** Type `A` to agree
3. **Share email with EFF:** Type `Y` or `N` (your choice)
4. **Redirect HTTP to HTTPS:** Type `2` to redirect (recommended)

**Expected output:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/h-rms.me/fullchain.pem
Key is saved at: /etc/letsencrypt/live/h-rms.me/privkey.pem
```

**Certbot automatically:**
- ✅ Updates your Nginx config with SSL settings
- ✅ Sets up automatic redirect from HTTP to HTTPS
- ✅ Configures certificate auto-renewal

---

## Step 9: Verify SSL Setup

```bash
# Test HTTPS (from your local machine or droplet)
curl https://h-rms.me
curl https://api.h-rms.me/api/health

# Check SSL certificate
openssl s_client -connect h-rms.me:443 -servername h-rms.me
```

**Or test in browser:**
- Visit: `https://h-rms.me` (should show your frontend)
- Visit: `https://api.h-rms.me/api/health` (should return JSON)

---

## Step 10: Verify Auto-Renewal

```bash
# Test certificate renewal (dry run)
sudo certbot renew --dry-run

# Check certbot timer status
sudo systemctl status certbot.timer

# Enable certbot timer (if not already enabled)
sudo systemctl enable certbot.timer
```

**Expected:** Certbot automatically renews certificates before they expire (every 90 days).

---

## Step 11: Update GitHub Secrets

Go to your GitHub repository: **Settings → Secrets and variables → Actions**

Update these secrets with your HTTPS URLs:

| Secret Name | Value |
|------------|-------|
| `FRONTEND_URL` | `https://h-rms.me` |
| `BACKEND_URL` | `https://api.h-rms.me` |
| `REACT_APP_BACKEND_URL` | `https://api.h-rms.me` |
| `REACT_APP_FRONTEND_URL` | `https://h-rms.me` |
| `DOMAIN` | `https://h-rms.me` |

**After updating secrets:** Your next CI/CD deployment will use the new URLs.

---

## Step 12: (Optional) Secure Container Ports

Since Nginx handles external traffic, you can bind containers to localhost only:

**Backend (`backend/docker-compose.yml`):**
```yaml
ports:
  - "127.0.0.1:8000:8000"  # Only accessible from localhost
```

**Frontend (`frontend/docker-compose.yml`):**
```yaml
ports:
  - "127.0.0.1:80:80"  # Only accessible from localhost
```

**Then restart containers:**
```bash
cd /opt/hrms/backend
docker-compose down && docker-compose up -d

cd /opt/hrms/frontend
docker-compose down && docker-compose up -d
```

This prevents direct external access to containers (extra security layer).

## Step 3: Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/hrms /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 8: Set Up SSL with Let's Encrypt

```bash
# Get SSL certificates for both domains
sudo certbot --nginx -d h-rms.me -d www.h-rms.me -d api.h-rms.me
```

**Certbot will ask you:**
1. **Email address:** Enter your email (for renewal notifications)
2. **Terms of Service:** Type `A` to agree
3. **Share email with EFF:** Type `Y` or `N` (your choice)
4. **Redirect HTTP to HTTPS:** Type `2` to redirect (recommended)

**Expected output:**
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/h-rms.me/fullchain.pem
Key is saved at: /etc/letsencrypt/live/h-rms.me/privkey.pem
```

**Certbot automatically:**
- ✅ Updates your Nginx config with SSL settings
- ✅ Sets up automatic redirect from HTTP to HTTPS
- ✅ Configures certificate auto-renewal

## Step 9: Verify SSL Setup

```bash
# Test HTTPS (from your local machine or droplet)
curl https://h-rms.me
curl https://api.h-rms.me/api/health

# Check SSL certificate
openssl s_client -connect h-rms.me:443 -servername h-rms.me
```

**Or test in browser:**
- Visit: `https://h-rms.me` (should show your frontend)
- Visit: `https://api.h-rms.me/api/health` (should return JSON)

## Step 10: Verify Auto-Renewal

```bash
# Test certificate renewal (dry run)
sudo certbot renew --dry-run

# Check certbot timer status
sudo systemctl status certbot.timer

# Enable certbot timer (if not already enabled)
sudo systemctl enable certbot.timer
```

**Expected:** Certbot automatically renews certificates before they expire (every 90 days).

## Step 11: Update GitHub Secrets

Go to your GitHub repository: **Settings → Secrets and variables → Actions**

Update these secrets with your HTTPS URLs:

| Secret Name | Value |
|------------|-------|
| `FRONTEND_URL` | `https://h-rms.me` |
| `BACKEND_URL` | `https://api.h-rms.me` |
| `REACT_APP_BACKEND_URL` | `https://api.h-rms.me` |
| `REACT_APP_FRONTEND_URL` | `https://h-rms.me` |
| `DOMAIN` | `https://h-rms.me` |

**After updating secrets:** Your next CI/CD deployment will use the new URLs.

## Step 12: (Optional) Secure Container Ports

Since Nginx handles external traffic, you can bind containers to localhost only:

**Backend (`backend/docker-compose.yml`):**
```yaml
ports:
  - "127.0.0.1:8000:8000"  # Only accessible from localhost
```

**Frontend (`frontend/docker-compose.yml`):**
```yaml
ports:
  - "127.0.0.1:80:80"  # Only accessible from localhost
```

**Then restart containers:**
```bash
cd /opt/hrms/backend
docker-compose down && docker-compose up -d

cd /opt/hrms/frontend
docker-compose down && docker-compose up -d
```

This prevents direct external access to containers (extra security layer).

---

## Step 13: Final Verification Checklist

Run these commands to verify everything is working:

```bash
# 1. Check DNS propagation
dig h-rms.me +short
dig api.h-rms.me +short
# Both should return your droplet IP

# 2. Check Nginx is running
sudo systemctl status nginx

# 3. Check Docker containers
docker ps
# Should show: hrms-frontend, hrms-backend, hrms-mysql

# 4. Test local connectivity
curl http://localhost:80          # Frontend
curl http://localhost:8000/api/health  # Backend

# 5. Test external HTTP (should redirect to HTTPS)
curl -I http://h-rms.me
curl -I http://api.h-rms.me/api/health

# 6. Test HTTPS
curl https://h-rms.me
curl https://api.h-rms.me/api/health

# 7. Check SSL certificate expiry
sudo certbot certificates
```

**All tests should pass! ✅**

---

## Quick Reference Commands

```bash
# View Nginx configuration
sudo cat /etc/nginx/sites-available/hrms

# Test Nginx config
sudo nginx -t

# Reload Nginx (after config changes)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Check SSL certificate status
sudo certbot certificates

# Manually renew certificates
sudo certbot renew

# View Docker containers
docker ps

# View Docker logs
docker logs hrms-frontend
docker logs hrms-backend
```

## Troubleshooting

### Nginx not routing correctly
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify Docker containers are running: `docker ps`
- Test container connectivity: `curl http://localhost:8000/api/health`

### SSL certificate issues
- Ensure DNS records are propagated: `dig h-rms.me` and `dig api.h-rms.me`
- Check firewall allows ports 80 and 443: `sudo ufw status`
- Verify domain ownership in DNS
- Check Certbot logs: `sudo tail -f /var/log/letsencrypt/letsencrypt.log`

### CORS errors
- Ensure `FRONTEND_URL` in backend includes: `https://h-rms.me`
- Check backend CORS configuration in `backend/index.js`
- Verify GitHub Secrets are updated with correct URLs
- Check browser console for specific CORS error messages

### Container connectivity issues
- Verify containers are on the same network: `docker network inspect hrms-network`
- Check container logs: `docker logs hrms-backend` and `docker logs hrms-frontend`
- Test from host: `curl http://localhost:8000/api/health`
- Verify ports are exposed: `docker ps` (check PORTS column)

## Security Considerations

1. **Firewall:** Only allow ports 22 (SSH), 80 (HTTP), and 443 (HTTPS)
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Rate Limiting:** Consider adding rate limiting in Nginx for API endpoints

3. **Security Headers:** Already configured in frontend nginx.conf, but you can add more in the reverse proxy config

