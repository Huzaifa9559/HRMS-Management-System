# Nginx Setup - Quick Start ⚡

## 🚀 Automated Setup (Recommended)

**Nginx is now automatically deployed via CI/CD pipeline!**

The frontend pipeline automatically:

- ✅ Copies nginx files to server
- ✅ Updates container ports (binds to localhost)
- ✅ Starts/restarts nginx container
- ✅ Configures reverse proxy

**You only need to:**

1. Ensure nginx files are in your repo (`nginx/` folder)
2. Push to main branch - pipeline handles the rest!

**For SSL setup (one-time manual step):**

- See "Manual SSL Setup" section below

---

## 📋 Manual Setup (If Needed)

## What You Need

- DNS records: `h-rms.me` and `api.h-rms.me` → Your droplet IP
- Docker containers running

---

## Step 1: Copy Files to Server

**From your local machine:**

```bash
# Copy nginx folder to server
scp -r nginx/ root@YOUR_DROPLET_IP:/opt/hrms/
```

**Or manually create on server:**

```bash
ssh root@YOUR_DROPLET_IP
mkdir -p /opt/hrms/nginx
cd /opt/hrms/nginx
# Then copy docker-compose.yml and nginx.conf.initial from your repo
```

---

## Step 2: Update Container Ports

**On server, update these files:**

**`/opt/hrms/backend/docker-compose.yml`** - Change line 37:

```yaml
ports:
  - "127.0.0.1:8000:8000" # Was: "8000:8000"
```

**`/opt/hrms/frontend/docker-compose.yml`** - Change line 10:

```yaml
ports:
  - "127.0.0.1:80:80" # Was: "80:80"
```

**Restart:**

```bash
cd /opt/hrms/backend && docker-compose restart
cd /opt/hrms/frontend && docker-compose restart
```

---

## Step 3: Start Nginx (HTTP First)

```bash
cd /opt/hrms/nginx

# Use initial config (no SSL redirect)
cp nginx.conf.initial nginx.conf

# Start nginx
docker-compose up -d

# Check it's running
docker ps | grep nginx
```

**Test:**

```bash
curl http://h-rms.me
curl http://api.h-rms.me/api/health
```

---

## Step 4: Get SSL Certificates

```bash
cd /opt/hrms/nginx

# Create certbot directories
mkdir -p certbot/conf certbot/www

# Get certificates (replace email!)
docker run -it --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d h-rms.me -d www.h-rms.me -d api.h-rms.me \
  --email YOUR_EMAIL@example.com \
  --agree-tos --no-eff-email
```

---

## Step 5: Download SSL Options

```bash
cd /opt/hrms/nginx

docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  certbot/certbot sh -c \
  "mkdir -p /etc/letsencrypt && \
   curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -o /etc/letsencrypt/options-ssl-nginx.conf && \
   curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem -o /etc/letsencrypt/ssl-dhparams.pem"
```

---

## Step 6: Switch to SSL Config

```bash
cd /opt/hrms/nginx

# Use full config with SSL
cp nginx.conf nginx.conf.backup
# Copy the full nginx.conf from repo (has SSL config)

# Restart nginx
docker-compose restart nginx
```

---

## Step 7: Test HTTPS

```bash
curl https://h-rms.me
curl https://api.h-rms.me/api/health
```

**Done! ✅**

---

## Update GitHub Secrets

- `FRONTEND_URL`: `https://h-rms.me`
- `BACKEND_URL`: `https://api.h-rms.me`
- `REACT_APP_BACKEND_URL`: `https://api.h-rms.me`
- `REACT_APP_FRONTEND_URL`: `https://h-rms.me`
- `DOMAIN`: `https://h-rms.me`

---

## 🔒 Manual SSL Setup (One-Time)

**After automated nginx deployment, set up SSL:**

```bash
# SSH to server
ssh root@YOUR_DROPLET_IP

# Get SSL certificates
cd /opt/hrms/nginx
mkdir -p certbot/conf certbot/www

docker run -it --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d h-rms.me -d www.h-rms.me -d api.h-rms.me \
  --email YOUR_EMAIL@example.com \
  --agree-tos --no-eff-email

# Download SSL options
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  certbot/certbot sh -c \
  "mkdir -p /etc/letsencrypt && \
   curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -o /etc/letsencrypt/options-ssl-nginx.conf && \
   curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem -o /etc/letsencrypt/ssl-dhparams.pem"

# Switch to SSL config (copy full nginx.conf from repo)
# Then restart nginx
docker-compose restart nginx
```

**After SSL setup, future deployments will automatically use SSL config!**

---

## Troubleshooting

**Nginx not starting?**

```bash
docker logs hrms-nginx
```

**SSL not working?**

- Check certificates: `ls -la certbot/conf/live/h-rms.me/`
- Check nginx config: `docker exec hrms-nginx nginx -t`

**Can't connect to backend/frontend?**

- Check containers: `docker ps`
- Check network: `docker network inspect hrms-network`
