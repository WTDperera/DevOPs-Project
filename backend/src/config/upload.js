/**
 * ==============================================
 * FILE UPLOAD CONFIGURATION (MULTER)
 * ==============================================
 * 
 * Configures Multer for handling video and image uploads
 * with validation, storage options, and file filtering.
 */

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import AppError from '../utils/appError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
const videosDir = path.join(uploadsDir, 'videos');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
const avatarsDir = path.join(uploadsDir, 'avatars');

[uploadsDir, videosDir, thumbnailsDir, avatarsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Storage configuration for videos
 */
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `video-${uniqueSuffix}${ext}`);
  },
});

/**
 * Storage configuration for images (thumbnails, avatars)
 */
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'avatar' ? avatarsDir : thumbnailsDir;
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'avatar' ? 'avatar' : 'thumbnail';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  },
});

/**
 * File filter for videos
 */
const videoFileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_VIDEO_TYPES?.split(',') || [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-flv',
    'video/webm',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type. Only ${allowedTypes.join(', ')} are allowed.`,
        400
      ),
      false
    );
  }
};

/**
 * File filter for images
 */
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
        400
      ),
      false
    );
  }
};

/**
 * Multer upload configurations
 */
export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 500 * 1024 * 1024, // 500MB default
  },
});

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for images
  },
});

/**
 * Memory storage for temporary processing
 */
export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default {
  uploadVideo,
  uploadImage,
  uploadMemory,
};
