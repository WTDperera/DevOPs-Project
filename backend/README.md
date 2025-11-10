# Lotus Backend API

Backend API for Lotus video sharing platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication**: JWT-based auth with secure password hashing
- 📹 **Video Management**: Upload, update, delete, and stream videos
- 💬 **Comments**: Nested comment system with replies
- 👍 **Engagement**: Like/dislike system for videos and comments
- 🔍 **Search & Filter**: Advanced search with category and tag filtering
- 📊 **Trending Algorithm**: Smart trending score calculation
- 🛡️ **Security**: Rate limiting, input validation, XSS protection
- 📝 **Logging**: Comprehensive logging with Winston
- 🚀 **Performance**: Pagination, indexing, and optimized queries

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB 6+ with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Winston

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- MongoDB 6.0 or higher

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/lotus-video-platform.git
cd lotus-video-platform/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/lotus

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# File Upload
MAX_FILE_SIZE=524288000
UPLOAD_PATH=./uploads

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod --dbpath /path/to/data/directory
```

**Or use MongoDB Atlas** (cloud):
Update `MONGODB_URI` in `.env` with your Atlas connection string.

### 5. Run the application

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:5000`

## Scripts

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── upload.js        # Multer file upload config
│   │   └── constants.js     # Application constants
│   │
│   ├── models/              # Mongoose models
│   │   ├── User.model.js    # User schema
│   │   ├── Video.model.js   # Video schema
│   │   ├── Comment.model.js # Comment schema
│   │   └── Like.model.js    # Like schema
│   │
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── video.controller.js   # Video operations
│   │   ├── comment.controller.js # Comment operations
│   │   └── like.controller.js    # Like operations
│   │
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   └── like.routes.js
│   │
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.js      # JWT verification
│   │   ├── error.middleware.js     # Error handling
│   │   └── validator.middleware.js # Request validation
│   │
│   ├── validators/          # Validation schemas
│   │   ├── auth.validator.js
│   │   ├── video.validator.js
│   │   └── comment.validator.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── logger.js        # Winston logger
│   │   ├── pagination.js    # Pagination helper
│   │   └── tokenUtils.js    # JWT utilities
│   │
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
├── uploads/                 # Uploaded files
│   ├── videos/
│   ├── thumbnails/
│   └── avatars/
│
├── logs/                    # Application logs
│   ├── combined.log
│   └── error.log
│
├── tests/                   # Test files
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .eslintrc.json           # ESLint config
├── .prettierrc              # Prettier config
├── .dockerignore
├── Dockerfile
└── package.json
```

## API Endpoints

### Authentication

| Method | Endpoint                   | Description            | Auth Required |
|--------|----------------------------|------------------------|---------------|
| POST   | `/api/auth/register`       | Register new user      | No            |
| POST   | `/api/auth/login`          | Login user             | No            |
| GET    | `/api/auth/me`             | Get current user       | Yes           |
| PUT    | `/api/auth/update-password`| Update password        | Yes           |
| PUT    | `/api/auth/update-profile` | Update profile         | Yes           |
| POST   | `/api/auth/logout`         | Logout user            | Yes           |
| DELETE | `/api/auth/delete-account` | Delete account         | Yes           |

### Videos

| Method | Endpoint                | Description              | Auth Required |
|--------|-------------------------|--------------------------|---------------|
| POST   | `/api/videos/upload`    | Upload new video         | Yes           |
| GET    | `/api/videos`           | Get all videos           | No            |
| GET    | `/api/videos/:id`       | Get video by ID          | No            |
| PUT    | `/api/videos/:id`       | Update video             | Yes (Owner)   |
| DELETE | `/api/videos/:id`       | Delete video             | Yes (Owner)   |
| GET    | `/api/videos/trending`  | Get trending videos      | No            |
| POST   | `/api/videos/:id/view`  | Increment view count     | No            |

### Comments

| Method | Endpoint                     | Description              | Auth Required |
|--------|------------------------------|--------------------------|---------------|
| POST   | `/api/comments`              | Create comment           | Yes           |
| GET    | `/api/comments/video/:id`    | Get video comments       | No            |
| PUT    | `/api/comments/:id`          | Update comment           | Yes (Owner)   |
| DELETE | `/api/comments/:id`          | Delete comment           | Yes (Owner)   |

### Likes

| Method | Endpoint                | Description              | Auth Required |
|--------|-------------------------|--------------------------|---------------|
| POST   | `/api/likes/toggle`     | Toggle like/dislike      | Yes           |
| GET    | `/api/likes/user/:id`   | Get user's likes         | No            |

### Users

| Method | Endpoint                | Description              | Auth Required |
|--------|-------------------------|--------------------------|---------------|
| GET    | `/api/users/:id`        | Get user profile         | No            |
| GET    | `/api/users/:id/videos` | Get user's videos        | No            |

For detailed API documentation, see [API.md](../docs/API.md)

## Database Models

### User Model
- Username, email, password (hashed)
- Profile information (avatar, bio)
- Subscriber counts
- Virtual relationship to videos

### Video Model
- Title, description, category, tags
- Video and thumbnail URLs
- Duration, view count, engagement metrics
- Trending score algorithm
- Text search indexing

### Comment Model
- Comment text
- Video and user references
- Parent comment (for replies)
- Like count, reply count
- Status (active/deleted/hidden)

### Like Model
- User and target references
- Target type (video/comment)
- Like type (like/dislike)
- Unique constraint per user-target pair

## Middleware

### Authentication
```javascript
// Protect routes requiring authentication
router.get('/profile', protect, getProfile);
```

### Validation
```javascript
// Validate request data
router.post('/register', registerValidation, validate, register);
```

### Error Handling
```javascript
// Centralized error handling
app.use(errorHandler);
```

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **Rate Limiting**: IP-based request throttling
4. **Input Validation**: express-validator for all inputs
5. **XSS Protection**: xss-clean middleware
6. **NoSQL Injection**: express-mongo-sanitize
7. **Security Headers**: Helmet middleware
8. **CORS**: Configured for specific origins
9. **HPP Protection**: Parameter pollution prevention

## File Upload

### Supported Formats

**Videos:**
- Max size: 500MB
- Formats: .mp4, .mov, .avi, .mkv, .webm

**Images (thumbnails/avatars):**
- Max size: 5MB
- Formats: .jpg, .jpeg, .png, .webp

### Upload Configuration

Files are stored locally in `uploads/` directory with organized subdirectories:
- `uploads/videos/` - Video files
- `uploads/thumbnails/` - Video thumbnails
- `uploads/avatars/` - User avatars

## Logging

Winston logger with multiple transports:
- **Console**: Colorized output for development
- **File (combined.log)**: All logs
- **File (error.log)**: Error logs only

Log levels: error, warn, info, debug

## Error Handling

Centralized error handling with custom `AppError` class:

```javascript
throw new AppError('Resource not found', 404);
```

All errors are caught and formatted consistently:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 404
  }
}
```

## Database Indexes

For optimal performance, the following indexes are created:

```javascript
// Users
{ email: 1 } (unique)
{ username: 1 } (unique)

// Videos
{ uploadedBy: 1, createdAt: -1 }
{ category: 1, views: -1 }
{ tags: 1 }
{ title: "text", description: "text" }

// Comments
{ videoId: 1, createdAt: -1 }
{ userId: 1 }

// Likes
{ userId: 1, targetId: 1, targetType: 1 } (unique)
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

## Docker

### Build image
```bash
docker build -t lotus-backend .
```

### Run container
```bash
docker run -p 5000:5000 --env-file .env lotus-backend
```

### Using Docker Compose
```bash
# From project root
docker-compose up backend
```

## Environment Variables

| Variable                    | Description                      | Default          |
|-----------------------------|----------------------------------|------------------|
| `NODE_ENV`                  | Environment (development/prod)   | development      |
| `PORT`                      | Server port                      | 5000             |
| `MONGODB_URI`               | MongoDB connection string        | -                |
| `JWT_SECRET`                | JWT signing secret               | -                |
| `JWT_EXPIRE`                | JWT expiration time              | 30d              |
| `JWT_COOKIE_EXPIRE`         | Cookie expiration (days)         | 30               |
| `MAX_FILE_SIZE`             | Max upload size (bytes)          | 524288000        |
| `UPLOAD_PATH`               | File upload directory            | ./uploads        |
| `CORS_ORIGIN`               | Allowed CORS origin              | *                |
| `RATE_LIMIT_WINDOW_MS`      | Rate limit window                | 900000           |
| `RATE_LIMIT_MAX_REQUESTS`   | Max requests per window          | 100              |
| `LOG_LEVEL`                 | Logging level                    | info             |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Code Style

This project uses:
- **ESLint** for linting
- **Prettier** for formatting
- **Conventional Commits** for commit messages

Run before committing:
```bash
npm run lint
npm run format
```

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Test connection
mongo mongodb://localhost:27017
```

### Port Already in Use
```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### File Upload Fails
- Check `UPLOAD_PATH` exists and has write permissions
- Verify `MAX_FILE_SIZE` is sufficient
- Check disk space

## Performance Tips

1. **Database Indexing**: Ensure indexes are created (see above)
2. **Pagination**: Use pagination for large result sets
3. **Projection**: Only select needed fields in queries
4. **Connection Pooling**: MongoDB connection pool configured
5. **Caching**: Consider adding Redis for frequently accessed data

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## Support

For issues and questions:
- Open an issue on GitHub
- Check [API Documentation](../docs/API.md)
- See [Deployment Guide](../docs/DEPLOYMENT.md)

## Acknowledgments

- Express.js community
- Mongoose ODM
- Winston logging library
- All open-source contributors
