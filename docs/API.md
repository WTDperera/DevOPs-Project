# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are obtained through login/register endpoints and stored in cookies.

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Validation:**
- `username`: 3-30 characters, alphanumeric + underscore
- `email`: Valid email format
- `password`: Minimum 6 characters
- `fullName`: 2-50 characters

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc123...",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "avatar": "https://ui-avatars.com/api/?name=John+Doe",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `400`: Validation error or user already exists
- `500`: Server error

---

### Login
**POST** `/api/auth/login`

Authenticate user and receive token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64abc123...",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "avatar": "https://...",
      "lastLogin": "2024-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `500`: Server error

---

### Get Current User
**GET** `/api/auth/me`

Get currently authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://...",
    "subscribers": 120,
    "subscribedTo": 45,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Errors:**
- `401`: Not authenticated
- `404`: User not found

---

### Update Password
**PUT** `/api/auth/update-password`

Change user password (requires current password).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Errors:**
- `400`: Current password incorrect
- `401`: Not authenticated

---

### Update Profile
**PUT** `/api/auth/update-profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "bio": "Video creator and tech enthusiast",
  "avatar": "https://new-avatar-url.com/image.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "username": "john_doe",
    "fullName": "John Smith",
    "bio": "Video creator and tech enthusiast",
    "avatar": "https://new-avatar-url.com/image.jpg"
  }
}
```

---

### Logout
**POST** `/api/auth/logout`

Logout user and clear token cookie.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Video Endpoints

### Upload Video
**POST** `/api/videos/upload`

Upload a new video with metadata.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
video: <video file> (required, max 500MB)
thumbnail: <image file> (required, max 5MB)
title: "My Awesome Video" (required, 3-100 chars)
description: "This is a great video about..." (required, 10-5000 chars)
tags: ["tech", "tutorial", "coding"] (optional, array)
category: "Education" (required)
visibility: "public" (optional, default: public)
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64xyz789...",
    "title": "My Awesome Video",
    "description": "This is a great video about...",
    "videoUrl": "/uploads/videos/1234567890.mp4",
    "thumbnailUrl": "/uploads/thumbnails/1234567890.jpg",
    "duration": 325,
    "category": "Education",
    "tags": ["tech", "tutorial", "coding"],
    "views": 0,
    "likes": 0,
    "dislikes": 0,
    "uploadedBy": {
      "_id": "64abc123...",
      "username": "john_doe",
      "avatar": "https://..."
    },
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Errors:**
- `400`: Validation error or missing files
- `401`: Not authenticated
- `413`: File too large

---

### Get All Videos
**GET** `/api/videos`

Get paginated list of videos with filtering and sorting.

**Query Parameters:**
```
page: 1 (default: 1)
limit: 12 (default: 12, max: 50)
sort: -createdAt (options: createdAt, -createdAt, views, -views, likes, -likes)
category: "Education" (optional)
search: "coding tutorial" (optional, searches title/description)
uploadedBy: "64abc123..." (optional, user ID)
```

**Example Request:**
```
GET /api/videos?page=1&limit=12&sort=-views&category=Education
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64xyz789...",
      "title": "Advanced JavaScript Tutorial",
      "description": "Learn advanced JS concepts...",
      "thumbnailUrl": "/uploads/thumbnails/...",
      "duration": 1245,
      "views": 15420,
      "likes": 892,
      "uploadedBy": {
        "_id": "64abc123...",
        "username": "tech_guru",
        "avatar": "https://..."
      },
      "createdAt": "2024-01-10T08:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalItems": 94,
    "itemsPerPage": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get Video by ID
**GET** `/api/videos/:id`

Get detailed information about a specific video.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64xyz789...",
    "title": "Advanced JavaScript Tutorial",
    "description": "Learn advanced JS concepts including closures, promises...",
    "videoUrl": "/uploads/videos/1234567890.mp4",
    "thumbnailUrl": "/uploads/thumbnails/1234567890.jpg",
    "duration": 1245,
    "category": "Education",
    "tags": ["javascript", "tutorial", "programming"],
    "views": 15420,
    "likes": 892,
    "dislikes": 23,
    "uploadedBy": {
      "_id": "64abc123...",
      "username": "tech_guru",
      "fullName": "Tech Guru",
      "avatar": "https://...",
      "subscribers": 45200
    },
    "createdAt": "2024-01-10T08:30:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Errors:**
- `404`: Video not found

---

### Update Video
**PUT** `/api/videos/:id`

Update video metadata (owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description...",
  "tags": ["new", "tags"],
  "visibility": "private"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64xyz789...",
    "title": "Updated Title",
    "description": "Updated description...",
    "tags": ["new", "tags"],
    "visibility": "private"
  }
}
```

**Errors:**
- `401`: Not authenticated
- `403`: Not authorized (not owner)
- `404`: Video not found

---

### Delete Video
**DELETE** `/api/videos/:id`

Delete video (owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

**Errors:**
- `401`: Not authenticated
- `403`: Not authorized
- `404`: Video not found

---

### Get Trending Videos
**GET** `/api/videos/trending`

Get trending videos based on engagement score.

**Query Parameters:**
```
limit: 20 (default: 20, max: 50)
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64xyz789...",
      "title": "Viral Tech Review",
      "thumbnailUrl": "/uploads/thumbnails/...",
      "views": 125000,
      "likes": 8900,
      "trendingScore": 95.5,
      "uploadedBy": {
        "username": "tech_reviewer",
        "avatar": "https://..."
      }
    }
  ]
}
```

---

### Increment Video Views
**POST** `/api/videos/:id/view`

Increment view count (rate limited per IP).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "views": 15421
  }
}
```

---

## Comment Endpoints

### Create Comment
**POST** `/api/comments`

Add a comment to a video.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "videoId": "64xyz789...",
  "text": "Great tutorial! Very helpful.",
  "parentComment": "64comment123..." // Optional, for replies
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64comment456...",
    "text": "Great tutorial! Very helpful.",
    "videoId": "64xyz789...",
    "userId": {
      "_id": "64abc123...",
      "username": "john_doe",
      "avatar": "https://..."
    },
    "likes": 0,
    "replies": 0,
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### Get Video Comments
**GET** `/api/comments/video/:videoId`

Get all comments for a video with pagination.

**Query Parameters:**
```
page: 1 (default: 1)
limit: 20 (default: 20)
sort: -createdAt (default: -createdAt, options: createdAt, -createdAt, -likes)
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64comment456...",
      "text": "Great tutorial!",
      "userId": {
        "_id": "64abc123...",
        "username": "john_doe",
        "avatar": "https://..."
      },
      "likes": 15,
      "replies": 3,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 47,
    "itemsPerPage": 20
  }
}
```

---

### Update Comment
**PUT** `/api/comments/:id`

Update comment text (owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "Updated comment text"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64comment456...",
    "text": "Updated comment text",
    "isEdited": true,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

### Delete Comment
**DELETE** `/api/comments/:id`

Delete comment (owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## Like Endpoints

### Toggle Like/Dislike
**POST** `/api/likes/toggle`

Like or dislike a video/comment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "targetId": "64xyz789...",
  "targetType": "video", // or "comment"
  "likeType": "like" // or "dislike"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "action": "liked", // or "unliked", "disliked", "undisliked"
    "likes": 893,
    "dislikes": 23
  }
}
```

---

### Get User Likes
**GET** `/api/likes/user/:userId`

Get all items liked by a user.

**Query Parameters:**
```
targetType: "video" // optional, filter by type
page: 1
limit: 20
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64like123...",
      "targetId": {
        "_id": "64xyz789...",
        "title": "Video Title",
        "thumbnailUrl": "..."
      },
      "targetType": "video",
      "likeType": "like",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

---

## User Endpoints

### Get User Profile
**GET** `/api/users/:id`

Get public profile of any user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "username": "john_doe",
    "fullName": "John Doe",
    "avatar": "https://...",
    "bio": "Content creator and developer",
    "subscribers": 1520,
    "subscribedTo": 89,
    "totalVideos": 24,
    "totalViews": 125000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get User Videos
**GET** `/api/users/:id/videos`

Get all videos uploaded by a user.

**Query Parameters:**
```
page: 1
limit: 12
sort: -createdAt
```

**Response:** Same format as Get All Videos

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "errors": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (not authorized)
- `404`: Not Found
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

---

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP
- Upload endpoint: 10 requests per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

---

## File Upload Constraints

**Videos:**
- Max size: 500MB
- Allowed formats: .mp4, .mov, .avi, .mkv, .webm
- Recommended: MP4 with H.264 codec

**Thumbnails:**
- Max size: 5MB
- Allowed formats: .jpg, .jpeg, .png, .webp
- Recommended size: 1280x720px

**Avatars:**
- Max size: 2MB
- Allowed formats: .jpg, .jpeg, .png, .webp
- Recommended size: 256x256px

---

## Pagination

All list endpoints support pagination:

**Request:**
```
?page=2&limit=20
```

**Response includes:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 2,
    "totalPages": 10,
    "totalItems": 195,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

---

## Search

The video search supports:
- Title matching
- Description matching
- Tag matching
- Case-insensitive
- Partial word matching

Example:
```
GET /api/videos?search=javascript+tutorial&category=Education&sort=-views
```
