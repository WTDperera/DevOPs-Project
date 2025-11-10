# Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Database Setup](#database-setup)
7. [SSL/HTTPS Setup](#sslhttps-setup)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Monitoring and Logging](#monitoring-and-logging)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: v6.0 or higher
- **Docker**: v20.x or higher
- **Docker Compose**: v2.x or higher
- **Git**: Latest version

### Optional Tools
- **PM2**: Process manager for Node.js
- **Nginx**: Reverse proxy (if not using Docker)
- **Certbot**: For SSL certificates

---

## Local Development

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/lotus-video-platform.git
cd lotus-video-platform
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Edit .env with API URL

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. MongoDB Setup
```bash
# Start MongoDB locally
mongod --dbpath /path/to/data/directory

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env
```

---

## Docker Deployment

### Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (caution: deletes data)
docker-compose down -v
```

**Services:**
- Frontend: http://localhost:80
- Backend API: http://localhost:80/api
- MongoDB: localhost:27017

### Production Docker Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Check service health
docker-compose -f docker-compose.prod.yml ps
```

---

## Production Deployment

### Server Requirements

**Minimum Specifications:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 50GB SSD
- Network: 100 Mbps

**Recommended:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 200GB+ SSD
- Network: 1 Gbps

### Deployment Steps

#### 1. Server Preparation (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Git
sudo apt install git -y
```

#### 2. Clone and Configure

```bash
# Clone repository
git clone https://github.com/yourusername/lotus-video-platform.git
cd lotus-video-platform

# Create production environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit with production values
nano backend/.env
nano frontend/.env
```

#### 3. Deploy with Docker

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
```

#### 4. Setup Nginx (if not using Docker Nginx)

```bash
# Install Nginx
sudo apt install nginx -y

# Copy configuration
sudo cp nginx/nginx.conf /etc/nginx/nginx.conf

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Environment Configuration

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://username:password@mongodb:27017/lotus?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# File Upload
MAX_FILE_SIZE=524288000
UPLOAD_PATH=/app/uploads

# CORS
CORS_ORIGIN=https://your-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=https://your-domain.com/api
VITE_WS_URL=wss://your-domain.com

# App Configuration
VITE_APP_NAME=Lotus
VITE_APP_DESCRIPTION=Video Sharing Platform

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ADS=false

# Upload Limits
VITE_MAX_VIDEO_SIZE=524288000
VITE_MAX_THUMBNAIL_SIZE=5242880
```

---

## Database Setup

### MongoDB with Docker

Already included in `docker-compose.yml`. Data persists in `mongodb_data` volume.

### External MongoDB (Atlas/Cloud)

```bash
# In backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lotus?retryWrites=true&w=majority
```

### Database Indexes

Create indexes for better performance:

```javascript
// Connect to MongoDB
use lotus

// User indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })

// Video indexes
db.videos.createIndex({ uploadedBy: 1, createdAt: -1 })
db.videos.createIndex({ category: 1, views: -1 })
db.videos.createIndex({ tags: 1 })
db.videos.createIndex({ title: "text", description: "text" })

// Comment indexes
db.comments.createIndex({ videoId: 1, createdAt: -1 })
db.comments.createIndex({ userId: 1, createdAt: -1 })

// Like indexes
db.likes.createIndex({ userId: 1, targetId: 1, targetType: 1 }, { unique: true })
db.likes.createIndex({ targetId: 1, targetType: 1 })
```

### Database Backup

```bash
# Backup MongoDB
docker exec mongodb mongodump --uri="mongodb://username:password@localhost:27017/lotus" --out=/backup

# Copy backup from container
docker cp mongodb:/backup ./backup-$(date +%Y%m%d)

# Restore from backup
docker exec mongodb mongorestore --uri="mongodb://username:password@localhost:27017" /backup/lotus
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (added automatically)
sudo certbot renew --dry-run
```

### Update Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## CI/CD Pipeline

### GitHub Actions Setup

1. **Add Secrets to GitHub Repository:**
   - Go to Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `DOCKER_USERNAME`: Your Docker Hub username
     - `DOCKER_PASSWORD`: Your Docker Hub password/token
     - `SERVER_HOST`: Production server IP
     - `SERVER_USERNAME`: SSH username
     - `SERVER_SSH_KEY`: Private SSH key
     - `API_URL`: Production API URL
     - `WS_URL`: Production WebSocket URL

2. **Pipeline Triggers:**
   - Push to `main` branch: Full CI/CD (test → build → deploy)
   - Push to `develop` branch: Test and build only
   - Pull requests: Run tests only

3. **Manual Deployment:**

```bash
# Trigger deployment manually
git tag v1.0.0
git push origin v1.0.0
```

### Docker Hub

```bash
# Login to Docker Hub
docker login

# Build and push manually
docker build -t yourusername/lotus-backend:latest ./backend
docker push yourusername/lotus-backend:latest

docker build -t yourusername/lotus-frontend:latest ./frontend
docker push yourusername/lotus-frontend:latest
```

---

## Monitoring and Logging

### Application Logs

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend

# Nginx logs
docker-compose logs -f nginx

# All services
docker-compose logs -f
```

### Log Files Location

- Backend: `/app/logs/` (inside container)
- Nginx: `/var/log/nginx/` (inside container)

### Access Logs

```bash
# View backend access logs
docker exec backend cat /app/logs/combined.log

# View Nginx access logs
docker exec nginx tail -f /var/log/nginx/access.log

# View error logs
docker exec nginx tail -f /var/log/nginx/error.log
```

### Health Checks

```bash
# Check service health
curl http://localhost/api/health

# Check all containers
docker-compose ps

# Inspect specific service
docker inspect lotus-backend
```

### Resource Monitoring

```bash
# Monitor Docker stats
docker stats

# Monitor specific service
docker stats lotus-backend

# Check disk usage
docker system df
```

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed

**Problem:** Backend can't connect to MongoDB

**Solution:**
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Verify connection string in .env
# For Docker: mongodb://username:password@mongodb:27017/lotus
```

#### 2. CORS Errors

**Problem:** Frontend can't access backend API

**Solution:**
```env
# In backend/.env, ensure CORS_ORIGIN matches frontend URL
CORS_ORIGIN=http://localhost:5173
# Or for production:
CORS_ORIGIN=https://your-domain.com
```

#### 3. File Upload Fails

**Problem:** Videos/images upload fails

**Solution:**
```bash
# Check upload directory permissions
docker exec backend ls -la /app/uploads

# Create directories if missing
docker exec backend mkdir -p /app/uploads/videos
docker exec backend mkdir -p /app/uploads/thumbnails

# Check file size limits in .env
MAX_FILE_SIZE=524288000  # 500MB
```

#### 4. Container Won't Start

**Problem:** Docker container keeps restarting

**Solution:**
```bash
# View container logs
docker-compose logs [service-name]

# Check resource usage
docker stats

# Remove and rebuild
docker-compose down
docker-compose up --build
```

#### 5. Port Already in Use

**Problem:** Port 80 or 5000 already taken

**Solution:**
```bash
# Find process using port
sudo lsof -i :80
sudo lsof -i :5000

# Kill process or change port in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead
```

### Performance Optimization

```bash
# Clean up unused Docker resources
docker system prune -a

# Optimize images
# Use multi-stage builds (already implemented)

# Enable caching
# Redis for session/cache (can be added)

# Database optimization
# Create indexes (see Database Setup section)
```

### Backup and Recovery

```bash
# Backup script
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh /path/to/backup

# Backup uploads directory
docker cp lotus-backend:/app/uploads ./uploads-backup
```

---

## Scaling

### Horizontal Scaling

```bash
# Scale backend instances
docker-compose up -d --scale backend=3

# Use load balancer (Nginx already configured)
```

### Database Scaling

```bash
# Use MongoDB replica set
# Update docker-compose.yml to add replica nodes
# Configure connection string for replica set
```

### CDN Integration

```bash
# Serve static files through CDN
# Update upload URLs to point to CDN
# Configure CORS for CDN domain
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW)
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] API key rotation
- [ ] Security headers (Helmet)
- [ ] Input validation
- [ ] SQL/NoSQL injection prevention
- [ ] XSS protection

---

## Support and Resources

- **Documentation**: `/docs` directory
- **API Reference**: `/docs/API.md`
- **Architecture**: `/docs/ARCHITECTURE.md`
- **GitHub Issues**: Report bugs and feature requests
- **Community**: Discord/Slack channel

---

## License

This project is licensed under the MIT License - see LICENSE file for details.
