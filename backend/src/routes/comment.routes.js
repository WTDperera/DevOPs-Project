/**
 * ==============================================
 * COMMENT ROUTES
 * ==============================================
 * 
 * Routes for comment endpoints
 */

import express from 'express';
import {
  getVideoComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentReplies,
} from '../controllers/comment.controller.js';
import { protect } from '../middleware/auth.js';
import {
  createCommentValidator,
  updateCommentValidator,
  commentIdValidator,
} from '../validators/comment.validator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Video comments routes
router.get('/video/:videoId', getVideoComments);
router.post('/video/:videoId', protect, createCommentValidator, validate, createComment);

// Individual comment routes
router.get('/:id/replies', commentIdValidator, validate, getCommentReplies);
router.put('/:id', protect, updateCommentValidator, validate, updateComment);
router.delete('/:id', protect, commentIdValidator, validate, deleteComment);

export default router;
