# Architecture Documentation

## System Overview

Lotus is a modern, scalable video sharing platform built using the MERN stack (MongoDB, Express.js, React, Node.js). The architecture follows microservices principles with containerization, designed for high availability and horizontal scalability.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐       │
│  │  Web App   │  │ Mobile App │  │  Third-party    │       │
│  │  (React)   │  │  (Future)  │  │  Integrations   │       │
│  └────────────┘  └────────────┘  └─────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway (Nginx)                      │
│  • Load Balancing  • Rate Limiting  • SSL/TLS               │
│  • Caching  • Compression  • Static File Serving            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────────────────────────────────────────────┐       │
│  │           Backend API (Node.js/Express)          │       │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │       │
│  │  │   Auth     │  │   Video    │  │  Comment   │ │       │
│  │  │  Service   │  │  Service   │  │  Service   │ │       │
│  │  └────────────┘  └────────────┘  └────────────┘ │       │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │       │
│  │  │   Like     │  │   User     │  │   Upload   │ │       │
│  │  │  Service   │  │  Service   │  │  Service   │ │       │
│  │  └────────────┘  └────────────┘  └────────────┘ │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐       │
│  │  MongoDB   │  │   Redis    │  │  File Storage   │       │
│  │ (Primary)  │  │  (Cache)   │  │  (S3/Local)     │       │
│  └────────────┘  └────────────┘  └─────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## Architecture Patterns

### 1. **MVC (Model-View-Controller)**
- **Models**: Data schema and business logic (Mongoose models)
- **Views**: Frontend React components
- **Controllers**: Request handlers and business logic orchestration

### 2. **RESTful API Design**
- Resource-based URLs
- HTTP methods for CRUD operations
- Stateless communication
- JSON response format

### 3. **Layered Architecture**

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (React Components, Redux Store)    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│          API Layer                  │
│  (Express Routes, Middleware)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│       Business Logic Layer          │
│  (Controllers, Services)            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        Data Access Layer            │
│  (Models, Database Operations)      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Database Layer              │
│  (MongoDB, File Storage)            │
└─────────────────────────────────────┘
```

---

## Backend Architecture

### Directory Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   ├── upload.js     # Multer configuration
│   │   └── constants.js  # App constants
│   │
│   ├── models/           # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── Video.model.js
│   │   ├── Comment.model.js
│   │   └── Like.model.js
│   │
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   └── like.controller.js
│   │
│   ├── routes/           # API endpoints
│   │   ├── auth.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   └── like.routes.js
│   │
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validator.middleware.js
│   │
│   ├── validators/       # Input validation schemas
│   │   ├── auth.validator.js
│   │   ├── video.validator.js
│   │   └── comment.validator.js
│   │
│   ├── utils/            # Utility functions
│   │   ├── logger.js
│   │   ├── pagination.js
│   │   └── tokenUtils.js
│   │
│   ├── app.js            # Express app configuration
│   └── server.js         # Entry point
│
├── uploads/              # File storage (local)
├── logs/                 # Application logs
├── tests/                # Unit and integration tests
└── package.json
```

### Data Flow

```
Request → Routes → Middleware → Validator → Controller → Model → Database
                                                    ↓
Response ← Error Handler ← Controller ← Model ← Database
```

### Middleware Stack

```javascript
1. Helmet                  // Security headers
2. CORS                    // Cross-origin resource sharing
3. Rate Limiter            // Prevent abuse
4. Body Parser             // Parse request body
5. Authentication          // Verify JWT token
6. Validation              // Validate input data
7. Route Handler           // Process request
8. Error Handler           // Catch and format errors
```

---

## Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── assets/           # Static assets
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/       # Reusable components
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── VideoCard.jsx
│   │   └── auth/
│   │       └── ProtectedRoute.jsx
│   │
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Upload.jsx
│   │   └── Profile.jsx
│   │
│   ├── layouts/          # Layout components
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── store/            # Redux state management
│   │   ├── index.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── videoSlice.js
│   │       └── themeSlice.js
│   │
│   ├── services/         # API service layer
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   ├── videoService.js
│   │   ├── commentService.js
│   │   └── likeService.js
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── useInfiniteScroll.js
│   │
│   ├── utils/            # Utility functions
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── constants.js
│   │
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
│
├── public/               # Public assets
├── tests/                # Component tests
└── package.json
```

### State Management

```
┌──────────────────────────────────────┐
│          Redux Store                 │
│                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │  Auth  │  │ Videos │  │ Theme  │ │
│  │ Slice  │  │ Slice  │  │ Slice  │ │
│  └────────┘  └────────┘  └────────┘ │
└──────────────────────────────────────┘
         ↓            ↓           ↓
┌──────────────────────────────────────┐
│       React Components               │
│  (Connected via useSelector/         │
│   useDispatch hooks)                 │
└──────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── MainLayout
│   ├── Header
│   │   ├── SearchBar
│   │   ├── UserMenu
│   │   └── NotificationBell
│   ├── Sidebar
│   │   ├── Navigation
│   │   └── SubscriptionList
│   └── Content
│       └── [Page Components]
│
└── AuthLayout
    ├── Logo
    └── [Auth Components]
```

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, indexed),
  email: String (unique, indexed),
  password: String (hashed),
  fullName: String,
  avatar: String,
  bio: String,
  subscribers: Number (default: 0),
  subscribedTo: Number (default: 0),
  lastLogin: Date,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { email: 1 } (unique)
- { username: 1 } (unique)
```

### Video Collection

```javascript
{
  _id: ObjectId,
  title: String (indexed),
  description: String,
  videoUrl: String,
  thumbnailUrl: String,
  duration: Number,
  category: String (indexed),
  tags: [String] (indexed),
  visibility: String (public/private/unlisted),
  uploadedBy: ObjectId (ref: User, indexed),
  views: Number (default: 0),
  likes: Number (default: 0),
  dislikes: Number (default: 0),
  commentCount: Number (default: 0),
  trendingScore: Number,
  slug: String (unique, indexed),
  createdAt: Date (indexed),
  updatedAt: Date
}

Indexes:
- { uploadedBy: 1, createdAt: -1 }
- { category: 1, views: -1 }
- { tags: 1 }
- { title: "text", description: "text" }
- { trendingScore: -1 }
```

### Comment Collection

```javascript
{
  _id: ObjectId,
  text: String,
  videoId: ObjectId (ref: Video, indexed),
  userId: ObjectId (ref: User, indexed),
  parentComment: ObjectId (ref: Comment, nullable),
  likes: Number (default: 0),
  replies: Number (default: 0),
  status: String (active/deleted/hidden),
  isEdited: Boolean (default: false),
  createdAt: Date (indexed),
  updatedAt: Date
}

Indexes:
- { videoId: 1, createdAt: -1 }
- { userId: 1, createdAt: -1 }
- { parentComment: 1 }
```

### Like Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  targetId: ObjectId (indexed),
  targetType: String (video/comment),
  likeType: String (like/dislike),
  createdAt: Date
}

Indexes:
- { userId: 1, targetId: 1, targetType: 1 } (unique)
- { targetId: 1, targetType: 1 }
```

### Relationships

```
User (1) ─────< (N) Video
User (1) ─────< (N) Comment
User (1) ─────< (N) Like
Video (1) ────< (N) Comment
Video (1) ────< (N) Like
Comment (1) ──< (N) Comment (replies)
Comment (1) ──< (N) Like
```

---

## API Architecture

### Authentication Flow

```
┌────────┐                    ┌────────┐                  ┌──────────┐
│ Client │                    │  API   │                  │ Database │
└───┬────┘                    └───┬────┘                  └────┬─────┘
    │                             │                            │
    │  POST /api/auth/register    │                            │
    │────────────────────────────>│                            │
    │                             │  Validate Input            │
    │                             │─────────┐                  │
    │                             │         │                  │
    │                             │<────────┘                  │
    │                             │                            │
    │                             │  Hash Password             │
    │                             │─────────┐                  │
    │                             │         │                  │
    │                             │<────────┘                  │
    │                             │                            │
    │                             │  Create User               │
    │                             │───────────────────────────>│
    │                             │                            │
    │                             │  User Created              │
    │                             │<───────────────────────────│
    │                             │                            │
    │                             │  Generate JWT              │
    │                             │─────────┐                  │
    │                             │         │                  │
    │                             │<────────┘                  │
    │                             │                            │
    │  { user, token }            │                            │
    │<────────────────────────────│                            │
    │                             │                            │
    │  Store token in cookie      │                            │
    │─────────┐                   │                            │
    │         │                   │                            │
    │<────────┘                   │                            │
```

### Video Upload Flow

```
┌────────┐              ┌────────┐              ┌──────────┐
│ Client │              │  API   │              │ Storage  │
└───┬────┘              └───┬────┘              └────┬─────┘
    │                       │                        │
    │  POST /api/videos/    │                        │
    │  upload (multipart)   │                        │
    │──────────────────────>│                        │
    │                       │  Verify Auth           │
    │                       │─────────┐              │
    │                       │         │              │
    │                       │<────────┘              │
    │                       │                        │
    │                       │  Validate Files        │
    │                       │─────────┐              │
    │                       │         │              │
    │                       │<────────┘              │
    │                       │                        │
    │                       │  Save Files            │
    │                       │───────────────────────>│
    │                       │                        │
    │                       │  File Paths            │
    │                       │<───────────────────────│
    │                       │                        │
    │                       │  Create Video Record   │
    │                       │─────────┐              │
    │                       │         │              │
    │                       │<────────┘              │
    │                       │                        │
    │  { video }            │                        │
    │<──────────────────────│                        │
```

---

## Security Architecture

### Authentication & Authorization

```
┌──────────────────────────────────────────┐
│          Security Layers                 │
├──────────────────────────────────────────┤
│ 1. Rate Limiting (IP-based)              │
│    - General: 100 req/15min              │
│    - Auth: 5 req/15min                   │
├──────────────────────────────────────────┤
│ 2. Input Validation (express-validator)  │
│    - Type checking                       │
│    - Format validation                   │
│    - Sanitization                        │
├──────────────────────────────────────────┤
│ 3. Authentication (JWT)                  │
│    - Token verification                  │
│    - Expiration check                    │
│    - User status check                   │
├──────────────────────────────────────────┤
│ 4. Authorization (Role-based)            │
│    - Resource ownership                  │
│    - Permission check                    │
├──────────────────────────────────────────┤
│ 5. Data Protection                       │
│    - Password hashing (bcrypt)           │
│    - NoSQL injection prevention          │
│    - XSS protection                      │
├──────────────────────────────────────────┤
│ 6. Security Headers (Helmet)             │
│    - HTTPS enforcement                   │
│    - CSP                                 │
│    - X-Frame-Options                     │
└──────────────────────────────────────────┘
```

### Password Security

```
Registration/Password Change:
1. Receive plain password
2. Validate strength (min 6 chars)
3. Generate salt (bcrypt, rounds: 10)
4. Hash password with salt
5. Store hashed password
6. Never store plain password

Login:
1. Receive credentials
2. Find user by email
3. Compare plain password with hash (bcrypt.compare)
4. If match: generate JWT
5. If no match: return error
```

---

## File Storage Architecture

### Current Implementation (Local)

```
uploads/
├── videos/
│   ├── 1234567890-video.mp4
│   └── 1234567891-video.mp4
├── thumbnails/
│   ├── 1234567890-thumb.jpg
│   └── 1234567891-thumb.jpg
└── avatars/
    ├── user-123-avatar.jpg
    └── user-456-avatar.jpg
```

### Future: Cloud Storage (AWS S3)

```
┌────────┐          ┌────────┐          ┌─────────┐
│ Client │          │  API   │          │   S3    │
└───┬────┘          └───┬────┘          └────┬────┘
    │                   │                    │
    │  Upload Request   │                    │
    │──────────────────>│                    │
    │                   │  Get Signed URL    │
    │                   │───────────────────>│
    │                   │                    │
    │                   │  Signed URL        │
    │                   │<───────────────────│
    │                   │                    │
    │  Signed URL       │                    │
    │<──────────────────│                    │
    │                   │                    │
    │  Upload File      │                    │
    │───────────────────────────────────────>│
    │                   │                    │
    │  Success          │                    │
    │<───────────────────────────────────────│
    │                   │                    │
    │  Confirm Upload   │                    │
    │──────────────────>│                    │
    │                   │  Save Metadata     │
    │                   │─────────┐          │
    │                   │         │          │
    │                   │<────────┘          │
```

---

## Caching Strategy (Future)

### Redis Cache Layers

```
┌──────────────────────────────────────────┐
│            Cache Hierarchy               │
├──────────────────────────────────────────┤
│ L1: Client-side (React Query)            │
│    - Component state                     │
│    - 5 minute stale time                 │
├──────────────────────────────────────────┤
│ L2: CDN Cache (Nginx/CloudFlare)         │
│    - Static assets                       │
│    - Video files                         │
│    - 1 year cache                        │
├──────────────────────────────────────────┤
│ L3: Application Cache (Redis)            │
│    - Trending videos: 15 min             │
│    - User profiles: 30 min               │
│    - Video metadata: 1 hour              │
├──────────────────────────────────────────┤
│ L4: Database                             │
│    - Source of truth                     │
│    - Indexed queries                     │
└──────────────────────────────────────────┘
```

---

## Scalability Considerations

### Horizontal Scaling

```
                    Load Balancer (Nginx)
                            │
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
    Backend 1           Backend 2           Backend 3
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ↓
                      MongoDB Cluster
                   (Primary + Replicas)
```

### Video Streaming Optimization

```
1. Adaptive Bitrate Streaming (HLS/DASH)
2. CDN Distribution
3. Range Request Support
4. Progressive Download
5. Thumbnail Generation (multiple sizes)
```

### Database Sharding (Future)

```
Shard by User ID:
- Shard 1: Users 0-999999
- Shard 2: Users 1000000-1999999
- Shard 3: Users 2000000+

Replica Sets per Shard:
- Primary (Read/Write)
- Secondary 1 (Read)
- Secondary 2 (Read)
```

---

## Monitoring and Observability

### Logging Levels

```
ERROR   - Critical failures
WARN    - Degraded functionality
INFO    - Normal operations
DEBUG   - Detailed diagnostics
```

### Metrics to Track

1. **Performance**
   - Response time (p50, p95, p99)
   - Throughput (requests/second)
   - Error rate

2. **Business**
   - Active users
   - Video uploads
   - Watch time
   - Engagement rate

3. **Infrastructure**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network bandwidth

---

## Technology Stack Summary

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB 6+ (Mongoose ODM)
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer
- **Validation**: express-validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Library**: React 18
- **Build Tool**: Vite 4
- **State**: Redux Toolkit + React Query
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3
- **HTTP Client**: Axios
- **Forms**: React Hook Form

### DevOps
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **CI/CD**: GitHub Actions
- **Version Control**: Git

### Future Additions
- **Cache**: Redis
- **Queue**: Bull/BullMQ
- **Search**: Elasticsearch
- **CDN**: CloudFront/CloudFlare
- **Storage**: AWS S3
- **Analytics**: Google Analytics / Mixpanel
- **Monitoring**: Prometheus + Grafana

---

## Design Principles

1. **Separation of Concerns**: Clear boundaries between layers
2. **DRY (Don't Repeat Yourself)**: Reusable components and utilities
3. **SOLID Principles**: Maintainable and extensible code
4. **Security First**: Multiple layers of security
5. **Performance**: Optimized queries, caching, lazy loading
6. **Scalability**: Horizontal scaling ready
7. **Maintainability**: Clear documentation, consistent coding style
8. **Testability**: Unit tests, integration tests

---

## Future Enhancements

1. **Real-time Features**
   - Live streaming
   - Real-time notifications
   - Live chat

2. **Advanced Features**
   - Recommendation engine (ML-based)
   - Content moderation (AI)
   - Adaptive video quality
   - Closed captions/subtitles

3. **Performance**
   - Video transcoding pipeline
   - Multi-CDN strategy
   - Advanced caching
   - Database optimization

4. **Analytics**
   - User behavior tracking
   - A/B testing
   - Performance monitoring
   - Business intelligence dashboard

---

This architecture is designed to be production-ready while maintaining flexibility for future enhancements and scaling requirements.
