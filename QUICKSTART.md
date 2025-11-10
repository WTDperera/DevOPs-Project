# 🚀 Quick Start Guide - Lotus Video Platform

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- MongoDB 6+ (for local development without Docker)

## Option 1: Docker (Recommended) ⚡

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/lotus-video-platform.git
cd lotus-video-platform
```

### 2. Generate package-lock.json files (First time only)
```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 3. Start All Services
```bash
# Build and start (production mode)
docker-compose up --build

# Or run in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### 4. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **API Health**: http://localhost/api/health
- **MongoDB**: localhost:27017

### 5. Stop Services
```bash
# Stop containers
docker-compose down

# Stop and remove volumes (⚠️ This deletes all data)
docker-compose down -v
```

---

## Option 2: Development Mode (Docker) 🔧

For hot-reload during development:

```bash
# Use development compose file
docker-compose -f docker-compose.dev.yml up --build

# Frontend will be available at: http://localhost:5173
# Backend API at: http://localhost:5000/api
```

---

## Option 3: Local Development (Without Docker) 💻

### 1. Start MongoDB
```bash
# Install and start MongoDB locally
mongod --dbpath /path/to/data/directory

# Or use MongoDB Atlas (cloud)
# Get connection string from: https://cloud.mongodb.com
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/lotus
# JWT_SECRET=your-secret-key-min-32-characters

# Start development server
npm run dev
```

Backend runs at: **http://localhost:5000**

### 3. Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 📦 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lotus
JWT_SECRET=your-super-secret-jwt-key-change-this-min-32-chars
JWT_EXPIRE=30d
MAX_FILE_SIZE=524288000
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
VITE_APP_NAME=Lotus
VITE_MAX_VIDEO_SIZE=524288000
VITE_MAX_THUMBNAIL_SIZE=5242880
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Check API health
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get all videos
curl http://localhost:5000/api/videos
```

### Using Postman/Insomnia

Import the API endpoints from `docs/API.md`

---

## 🐳 Docker Commands Cheat Sheet

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose stop

# Remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Restart a specific service
docker-compose restart backend

# Execute command in container
docker-compose exec backend sh

# View running containers
docker-compose ps

# Check service health
docker-compose ps

# Rebuild specific service
docker-compose up --build backend
```

---

## 🔍 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Nginx Error: "host not found in upstream"
```bash
# Wait for backend to be fully started
# The updated configuration includes retry logic

# Check backend status
docker-compose ps backend

# View backend logs
docker-compose logs backend
```

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :80
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
```

### File Upload Fails
```bash
# Check upload directories exist
docker-compose exec backend ls -la /app/uploads

# Create directories if missing
docker-compose exec backend mkdir -p /app/uploads/videos
docker-compose exec backend mkdir -p /app/uploads/thumbnails
```

### Frontend Not Loading
```bash
# Clear browser cache
# Check if frontend is running
docker-compose ps frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Database Not Persisting
```bash
# Check volumes
docker volume ls

# Remove old volumes (⚠️ deletes data)
docker-compose down -v

# Restart with fresh data
docker-compose up --build
```

---

## 📊 Default Credentials

When using Docker Compose:

**MongoDB:**
- Username: `lotus_admin`
- Password: `lotus_secure_password_2024`
- Database: `lotus`

**Application:**
- No default users
- Create account via `/api/auth/register`

---

## 🔐 Security Checklist Before Production

- [ ] Change MongoDB credentials in docker-compose.yml
- [ ] Generate strong JWT_SECRET (min 32 characters)
- [ ] Update CORS_ORIGIN to your domain
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Review and update rate limits
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable monitoring/logging
- [ ] Review file upload limits

---

## 📚 Next Steps

1. **Read Documentation**
   - [API Documentation](docs/API.md)
   - [Deployment Guide](docs/DEPLOYMENT.md)
   - [Architecture Overview](docs/ARCHITECTURE.md)

2. **Explore Features**
   - Register a user account
   - Upload a test video
   - Try search and trending
   - Test comments and likes

3. **Customize**
   - Modify color scheme in `frontend/tailwind.config.js`
   - Add custom logo in `frontend/public/`
   - Configure email notifications
   - Set up analytics

4. **Deploy**
   - Follow deployment guide for production
   - Set up CI/CD pipeline
   - Configure domain and SSL

---

## 🆘 Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: Open issue on GitHub
- **API Reference**: See `docs/API.md`
- **Architecture**: See `docs/ARCHITECTURE.md`

---

## 📝 Common Development Workflows

### Adding a New Feature

1. Create feature branch
```bash
git checkout -b feature/my-feature
```

2. Make changes to code

3. Test locally
```bash
npm run dev
```

4. Run linter
```bash
npm run lint
```

5. Commit and push
```bash
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

### Database Backup

```bash
# Backup
docker-compose exec mongodb mongodump --uri="mongodb://lotus_admin:lotus_secure_password_2024@localhost:27017/lotus" --out=/backup

# Copy from container
docker cp lotus-mongodb:/backup ./backup-$(date +%Y%m%d)
```

### View Application Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

---

## ✅ Verify Installation

After starting the services, verify everything is working:

1. ✅ Backend Health: http://localhost/api/health
2. ✅ Frontend: http://localhost
3. ✅ MongoDB: `docker-compose ps mongodb` (should show "healthy")
4. ✅ Can register a user
5. ✅ Can login
6. ✅ Can view videos page

---

**Happy Coding! 🪷**
