/**
 * ==============================================
 * VIDEO ROUTES
 * ==============================================
 * 
 * Routes for video endpoints
 */

import express from 'express';
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getTrendingVideos,
  getRecommendedVideos,
  getUserVideos,
} from '../controllers/video.controller.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { uploadVideo as uploadVideoMiddleware } from '../config/upload.js';
import {
  createVideoValidator,
  updateVideoValidator,
  videoIdValidator,
  getVideosValidator,
} from '../validators/video.validator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Public routes
router.get('/', getVideosValidator, validate, getAllVideos);
router.get('/trending', getTrendingVideos);
router.get('/user/:userId', getUserVideos);
router.get('/:id', videoIdValidator, validate, optionalAuth, getVideoById);
router.get('/:id/recommended', videoIdValidator, validate, getRecommendedVideos);

// Protected routes
router.post(
  '/upload',
  protect,
  uploadVideoMiddleware.single('video'),
  createVideoValidator,
  validate,
  uploadVideo
);

router.put('/:id', protect, updateVideoValidator, validate, updateVideo);

router.delete('/:id', protect, videoIdValidator, validate, deleteVideo);

export default router;
