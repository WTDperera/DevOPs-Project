// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Lotus';
export const APP_DESCRIPTION =
  import.meta.env.VITE_APP_DESCRIPTION || 'Modern Video Sharing Platform';

// File Upload Limits
export const MAX_VIDEO_SIZE = parseInt(import.meta.env.VITE_MAX_VIDEO_SIZE) || 524288000; // 500MB
export const MAX_IMAGE_SIZE = parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE) || 5242880; // 5MB

// Allowed file types
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-flv',
  'video/webm',
];

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Pagination
export const VIDEOS_PER_PAGE = parseInt(import.meta.env.VITE_VIDEOS_PER_PAGE) || 12;
export const COMMENTS_PER_PAGE = parseInt(import.meta.env.VITE_COMMENTS_PER_PAGE) || 20;

// Video Categories
export const VIDEO_CATEGORIES = [
  'Education',
  'Entertainment',
  'Gaming',
  'Music',
  'Sports',
  'Technology',
  'Travel',
  'Lifestyle',
  'News',
  'Other',
];

// Video Privacy Options
export const VIDEO_PRIVACY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  UNLISTED: 'unlisted',
};

// Sort Options
export const SORT_OPTIONS = [
  { label: 'Latest', value: '-createdAt' },
  { label: 'Oldest', value: 'createdAt' },
  { label: 'Most Viewed', value: '-views' },
  { label: 'Most Liked', value: '-likesCount' },
  { label: 'Trending', value: '-trendingScore' },
];

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  UPLOAD: '/upload',
  VIDEO: '/video/:id',
  CHANNEL: '/channel/:id',
  SEARCH: '/search',
  TRENDING: '/trending',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  DARK_MODE: 'darkMode',
  VOLUME: 'videoVolume',
  PLAYBACK_RATE: 'playbackRate',
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  VIDEO_UPLOAD_SUCCESS: 'Video uploaded successfully!',
  VIDEO_UPDATE_SUCCESS: 'Video updated successfully!',
  VIDEO_DELETE_SUCCESS: 'Video deleted successfully!',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
  COMMENT_POST_SUCCESS: 'Comment posted successfully!',
  COMMENT_DELETE_SUCCESS: 'Comment deleted successfully!',
};

export default {
  API_URL,
  WS_URL,
  APP_NAME,
  APP_DESCRIPTION,
  MAX_VIDEO_SIZE,
  MAX_IMAGE_SIZE,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_IMAGE_TYPES,
  VIDEOS_PER_PAGE,
  COMMENTS_PER_PAGE,
  VIDEO_CATEGORIES,
  VIDEO_PRIVACY,
  SORT_OPTIONS,
  USER_ROLES,
  ROUTES,
  STORAGE_KEYS,
  REGEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
