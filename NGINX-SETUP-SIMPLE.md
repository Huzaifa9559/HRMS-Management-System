# Nginx Reverse Proxy Setup - Simple Docker Method 🚀

**Fastest & Easiest Way - Using Docker!**

## Prerequisites
✅ DNS records created:
- `h-rms.me` → A record → Your droplet IP
- `api.h-rms.me` → A record → Your droplet IP

✅ Docker containers running (frontend & backend)

---

## Step 1: Update Container Ports (Bind to localhost only)

**Backend** (`backend/docker-compose.yml`):
```yaml
ports:
  - "127.0.0.1:8000:8000"  # Change from "8000:8000"
```

**Frontend** (`frontend/docker-compose.yml`):
```yaml
ports:
  - "127.0.0.1:80:80"  # Change from "80:80"
```

**Restart containers:**
```bash
cd /opt/hrms/backend && docker-compose down && docker-compose up -d
cd /opt/hrms/frontend && docker-compose down && docker-compose up -d
```

---

## Step 2: Create Nginx Directory on Server

```bash
# SSH into your droplet
ssh root@YOUR_DROPLET_IP

# Create nginx directory
mkdir -p /opt/hrms/nginx
cd /opt/hrms/nginx
```

---

## Step 3: Create Files

**Create `docker-compose.yml`:**
```bash
nano docker-compose.yml
```

Paste this:
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: hrms-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    networks:
      - hrms-network
    depends_on:
      - frontend
      - backend
    command: "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'"

  certbot:
    image: certbot/certbot
    container_name: hrms-certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

networks:
  hrms-network:
    external: true
    name: hrms-network
```

**Create `nginx.conf`:**
```bash
nano nginx.conf
```

Paste this:
```nginx
# Frontend Configuration - h-rms.me
server {
    listen 80;
    server_name h-rms.me www.h-rms.me;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# Backend API Configuration - api.h-rms.me
server {
    listen 80;
    server_name api.h-rms.me;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# Frontend HTTPS Configuration
server {
    listen 443 ssl http2;
    server_name h-rms.me www.h-rms.me;

    ssl_certificate /etc/letsencrypt/live/h-rms.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/h-rms.me/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    client_max_body_size 50M;

    location / {
        proxy_pass http://hrms-frontend:80;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend HTTPS Configuration
server {
    listen 443 ssl http2;
    server_name api.h-rms.me;

    ssl_certificate /etc/letsencrypt/live/h-rms.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/h-rms.me/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparams /etc/letsencrypt/ssl-dhparams.pem;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    client_max_body_size 50M;

    location / {
        proxy_pass http://hrms-backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Create directories:**
```bash
mkdir -p certbot/conf certbot/www
```

---

## Step 4: Use Initial Config (Before SSL)

```bash
# Copy initial config (allows HTTP, no redirect)
cp nginx.conf.initial nginx.conf
```

## Step 5: Start Nginx (HTTP only first)

```bash
cd /opt/hrms/nginx
docker-compose up -d
```

**Check it's running:**
```bash
docker ps | grep nginx
```

**Test HTTP:**
```bash
curl http://h-rms.me
curl http://api.h-rms.me/api/health
```

---

## Step 6: Get SSL Certificates

```bash
# Run certbot container to get certificates
docker run -it --rm \
  -v /opt/hrms/nginx/certbot/conf:/etc/letsencrypt \
  -v /opt/hrms/nginx/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d h-rms.me \
  -d www.h-rms.me \
  -d api.h-rms.me \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

**Replace `your-email@example.com` with your email!**

---

## Step 7: Switch to SSL Config

```bash
# Now use the full config with SSL
cp nginx.conf nginx.conf.backup  # Backup initial
# The nginx.conf already has SSL config, just restart
```

## Step 8: Download SSL Options

```bash
# Download recommended SSL options
docker run --rm \
  -v /opt/hrms/nginx/certbot/conf:/etc/letsencrypt \
  certbot/certbot \
  sh -c "mkdir -p /etc/letsencrypt && curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -o /etc/letsencrypt/options-ssl-nginx.conf && curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem -o /etc/letsencrypt/ssl-dhparams.pem"
```

---

## Step 9: Restart Nginx

```bash
cd /opt/hrms/nginx
docker-compose restart nginx
```

---

## Step 10: Test!

```bash
# Test HTTPS
curl https://h-rms.me
curl https://api.h-rms.me/api/health
```

**Or open in browser:**
- `https://h-rms.me` ✅
- `https://api.h-rms.me/api/health` ✅

---

## Step 11: Update GitHub Secrets

Go to GitHub: **Settings → Secrets → Actions**

Update:
- `FRONTEND_URL`: `https://h-rms.me`
- `BACKEND_URL`: `https://api.h-rms.me`
- `REACT_APP_BACKEND_URL`: `https://api.h-rms.me`
- `REACT_APP_FRONTEND_URL`: `https://h-rms.me`
- `DOMAIN`: `https://h-rms.me`

---

## Done! 🎉

**That's it!** Your Nginx reverse proxy is running in Docker with SSL.

**Auto-renewal:** The certbot container automatically renews certificates every 12 hours.

---

## Quick Commands

```bash
# View logs
docker logs hrms-nginx

# Restart nginx
cd /opt/hrms/nginx && docker-compose restart nginx

# Stop nginx
cd /opt/hrms/nginx && docker-compose down

# Start nginx
cd /opt/hrms/nginx && docker-compose up -d
```

