# 🪷 Lotus - Modern Video Sharing & Streaming Platform

<div align="center">

![Lotus Platform](https://img.shields.io/badge/Lotus-Video_Platform-purple?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge)
![CI/CD](https://img.shields.io/badge/CI/CD-GitHub_Actions-orange?style=for-the-badge)

A production-ready, full-stack video sharing and streaming web application built with modern technologies and DevOps best practices.

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**Lotus** is a scalable, high-performance video sharing platform that enables users to upload, stream, and interact with video content. Built with the MERN stack and modern DevOps practices, it demonstrates enterprise-level development skills including:

- **Full-stack Development**: React frontend with Node.js/Express backend
- **Database Design**: MongoDB with Mongoose ODM
- **Security**: JWT authentication, bcrypt encryption, secure API endpoints
- **DevOps**: Docker containerization, CI/CD with GitHub Actions
- **Cloud-Ready**: Designed for AWS deployment (EC2/ECS, S3, CloudFront)

---

## ✨ Features

### Core Features
- 🔐 **Secure Authentication**: JWT-based user registration and login
- 📹 **Video Upload & Management**: Multi-format video upload with metadata
- 🎬 **High-Performance Streaming**: Optimized video delivery with minimal buffering
- 💬 **User Engagement**: Comments, likes, and interactive features
- 🔍 **Advanced Search**: Full-text search across video titles and descriptions
- 📱 **Responsive Design**: Mobile-first, fully responsive UI
- 👤 **User Profiles**: Personal channels with uploaded video collections

### Advanced Features
- 🎯 **Adaptive Bitrate Streaming (ABS)**: HLS protocol for quality adjustment
- 🤖 **Recommendation Engine**: AI-powered video suggestions
- 📊 **Analytics Dashboard**: View counts, engagement metrics
- 🔔 **Real-time Notifications**: WebSocket-based updates
- 🎨 **Customizable Themes**: Dark/light mode support
- 🌐 **Multi-language Support**: i18n ready

---

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **Video.js** - Advanced video player

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **FFmpeg** - Video processing
- **Socket.io** - Real-time communication

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy & static file server
- **AWS Services**:
  - EC2/ECS - Container hosting
  - S3 - Video storage
  - CloudFront - CDN
  - Route 53 - DNS management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Supertest** - API testing
- **Husky** - Git hooks

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React App (Vite)                                     │  │
│  │  - Redux Toolkit (State Management)                   │  │
│  │  - React Router (Navigation)                          │  │
│  │  - Axios (HTTP Client)                                │  │
│  │  - Video.js (Video Player)                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                      Nginx Reverse Proxy                     │
│  - Static File Serving                                       │
│  - SSL Termination                                           │
│  - Load Balancing                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓ API Requests
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Node.js + Express.js                                 │  │
│  │  ┌────────────┬────────────┬────────────┐            │  │
│  │  │ Auth       │ Video      │ User       │            │  │
│  │  │ Service    │ Service    │ Service    │            │  │
│  │  └────────────┴────────────┴────────────┘            │  │
│  │  Middleware: Auth, Validation, Error Handling         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ Mongoose ODM
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB                                              │  │
│  │  - Users Collection                                   │  │
│  │  - Videos Collection                                  │  │
│  │  - Comments Collection                                │  │
│  │  - Likes Collection                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ File Storage
┌─────────────────────────────────────────────────────────────┐
│                      Storage Layer                           │
│  AWS S3 / Local Storage                                      │
│  - Video Files (Multiple Resolutions)                        │
│  - Thumbnails                                                │
│  - User Avatars                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **MongoDB** (v6+ or MongoDB Atlas account)
- **Docker** & **Docker Compose** (optional, for containerized deployment)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lotus-video-platform.git
   cd lotus-video-platform
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Backend (.env)
   cp backend/.env.example backend/.env
   
   # Frontend (.env)
   cp frontend/.env.example frontend/.env
   ```

   Update the `.env` files with your configuration:
   
   **Backend `.env`:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lotus
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_S3_BUCKET=lotus-videos
   AWS_REGION=us-east-1
   ```

   **Frontend `.env`:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_WS_URL=http://localhost:5000
   ```

4. **Start Development Servers**
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory, in new terminal)
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

### Using Docker (Recommended)

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Access the Application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:80/api

3. **View logs**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services**
   ```bash
   docker-compose down
   ```

---

## 📁 Project Structure

```
lotus-video-platform/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── validators/        # Input validation
│   │   └── app.js             # Express app setup
│   ├── tests/                 # Test files
│   ├── uploads/               # Local file uploads
│   ├── .env.example           # Environment variables template
│   ├── Dockerfile             # Backend Docker image
│   ├── package.json           # Backend dependencies
│   └── README.md              # Backend documentation
│
├── frontend/                   # React/Vite frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── layouts/           # Layout components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Redux store
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   ├── constants/         # App constants
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── .env.example           # Environment variables template
│   ├── Dockerfile             # Frontend Docker image
│   ├── package.json           # Frontend dependencies
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── vite.config.js         # Vite configuration
│   └── README.md              # Frontend documentation
│
├── nginx/                      # Nginx configuration
│   ├── nginx.conf             # Main Nginx config
│   └── Dockerfile             # Nginx Docker image
│
├── .github/                    # GitHub specific files
│   └── workflows/
│       └── ci-cd.yml          # CI/CD pipeline
│
├── docs/                       # Additional documentation
│   ├── API.md                 # API documentation
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── ARCHITECTURE.md        # Architecture details
│
├── scripts/                    # Utility scripts
│   ├── setup.sh               # Initial setup script
│   └── deploy.sh              # Deployment script
│
├── docker-compose.yml          # Docker Compose configuration
├── docker-compose.dev.yml      # Development Docker Compose
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier configuration
├── .eslintrc.json              # ESLint configuration
├── LICENSE                     # License file
└── README.md                   # This file
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Video Endpoints

#### Upload Video
```http
POST /api/videos/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "video": [file],
  "title": "My Video",
  "description": "Video description",
  "tags": ["tutorial", "tech"]
}
```

#### Get All Videos
```http
GET /api/videos?page=1&limit=10&sort=-createdAt
```

#### Get Single Video
```http
GET /api/videos/:videoId
```

#### Update Video
```http
PUT /api/videos/:videoId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Video
```http
DELETE /api/videos/:videoId
Authorization: Bearer {token}
```

For complete API documentation, see [docs/API.md](./docs/API.md)

---

## 🚢 Deployment

### Production Deployment with Docker

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.yml build
   ```

2. **Push to container registry**
   ```bash
   docker tag lotus-frontend:latest yourdockerhub/lotus-frontend:latest
   docker tag lotus-backend:latest yourdockerhub/lotus-backend:latest
   docker push yourdockerhub/lotus-frontend:latest
   docker push yourdockerhub/lotus-backend:latest
   ```

3. **Deploy to server**
   ```bash
   # SSH into your server
   ssh user@your-server-ip
   
   # Pull and run containers
   docker-compose pull
   docker-compose up -d
   ```

### AWS Deployment

Detailed AWS deployment instructions available in [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- MERN Stack Community
- Docker & DevOps Community
- All contributors and supporters

---

<div align="center">

**Built with ❤️ using MERN Stack**

</div>
#   D e v O P s - P r o j e c t  
 