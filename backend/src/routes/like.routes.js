/**
 * ==============================================
 * LIKE ROUTES
 * ==============================================
 * 
 * Routes for like/dislike endpoints
 */

import express from 'express';
import {
  toggleVideoLike,
  toggleVideoDislike,
  toggleCommentLike,
  getVideoLikeStatus,
} from '../controllers/like.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Video likes
router.post('/video/:videoId/like', toggleVideoLike);
router.post('/video/:videoId/dislike', toggleVideoDislike);
router.get('/video/:videoId/status', getVideoLikeStatus);

// Comment likes
router.post('/comment/:commentId/like', toggleCommentLike);

export default router;
