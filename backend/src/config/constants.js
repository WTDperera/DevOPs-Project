/**
 * ==============================================
 * APPLICATION CONSTANTS
 * ==============================================
 * 
 * Central location for all application-wide constants
 * and configuration values.
 */

export const CONSTANTS = {
  // User roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
  },

  // Video status
  VIDEO_STATUS: {
    PROCESSING: 'processing',
    READY: 'ready',
    FAILED: 'failed',
    DELETED: 'deleted',
  },

  // Video privacy settings
  VIDEO_PRIVACY: {
    PUBLIC: 'public',
    PRIVATE: 'private',
    UNLISTED: 'unlisted',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },

  // File sizes
  FILE_SIZES: {
    VIDEO_MAX: 500 * 1024 * 1024, // 500MB
    IMAGE_MAX: 5 * 1024 * 1024, // 5MB
  },

  // Video resolutions for processing
  VIDEO_RESOLUTIONS: {
    '1080p': { width: 1920, height: 1080, bitrate: '5000k' },
    '720p': { width: 1280, height: 720, bitrate: '2500k' },
    '480p': { width: 854, height: 480, bitrate: '1000k' },
    '360p': { width: 640, height: 360, bitrate: '500k' },
  },

  // Comment status
  COMMENT_STATUS: {
    ACTIVE: 'active',
    HIDDEN: 'hidden',
    DELETED: 'deleted',
  },

  // Notification types
  NOTIFICATION_TYPES: {
    NEW_VIDEO: 'new_video',
    NEW_COMMENT: 'new_comment',
    NEW_LIKE: 'new_like',
    NEW_SUBSCRIBER: 'new_subscriber',
    REPLY: 'reply',
  },

  // Sort options
  SORT_OPTIONS: {
    NEWEST: '-createdAt',
    OLDEST: 'createdAt',
    MOST_VIEWS: '-views',
    MOST_LIKES: '-likesCount',
    TRENDING: '-trendingScore',
  },

  // Cache durations (in seconds)
  CACHE_DURATIONS: {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
  },

  // Rate limiting
  RATE_LIMITS: {
    GENERAL: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
    },
    AUTH: {
      windowMs: 15 * 60 * 1000,
      max: 5,
    },
    UPLOAD: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10,
    },
  },

  // Error messages
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'You are not authorized to perform this action',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already exists',
    USERNAME_EXISTS: 'Username already exists',
    VIDEO_NOT_FOUND: 'Video not found',
    USER_NOT_FOUND: 'User not found',
    COMMENT_NOT_FOUND: 'Comment not found',
  },

  // Success messages
  SUCCESS_MESSAGES: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    VIDEO_UPLOAD_SUCCESS: 'Video uploaded successfully',
    VIDEO_UPDATE_SUCCESS: 'Video updated successfully',
    VIDEO_DELETE_SUCCESS: 'Video deleted successfully',
    PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
    COMMENT_POST_SUCCESS: 'Comment posted successfully',
    COMMENT_DELETE_SUCCESS: 'Comment deleted successfully',
  },

  // Regex patterns
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
    STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
};

export default CONSTANTS;
