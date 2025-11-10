/**
 * ==============================================
 * LIKE CONTROLLER
 * ==============================================
 * 
 * Handles like/dislike operations
 */

import Like from '../models/Like.model.js';
import Video from '../models/Video.model.js';
import Comment from '../models/Comment.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess } from '../utils/response.js';
import CONSTANTS from '../config/constants.js';

/**
 * @desc    Toggle like on a video
 * @route   POST /api/videos/:videoId/like
 * @access  Private
 */
export const toggleVideoLike = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);

  if (!video) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.VIDEO_NOT_FOUND, 404));
  }

  if (!video.allowLikes) {
    return next(new AppError('Likes are disabled for this video', 403));
  }

  const result = await Like.toggleLike(req.user.id, req.params.videoId, 'video', 'like');

  sendSuccess(res, 200, result, `Video ${result.action} successfully`);
});

/**
 * @desc    Toggle dislike on a video
 * @route   POST /api/videos/:videoId/dislike
 * @access  Private
 */
export const toggleVideoDislike = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);

  if (!video) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.VIDEO_NOT_FOUND, 404));
  }

  if (!video.allowLikes) {
    return next(new AppError('Likes are disabled for this video', 403));
  }

  const result = await Like.toggleLike(req.user.id, req.params.videoId, 'video', 'dislike');

  sendSuccess(res, 200, result, `Video ${result.action} successfully`);
});

/**
 * @desc    Toggle like on a comment
 * @route   POST /api/comments/:commentId/like
 * @access  Private
 */
export const toggleCommentLike = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.COMMENT_NOT_FOUND, 404));
  }

  const result = await Like.toggleLike(req.user.id, req.params.commentId, 'comment', 'like');

  sendSuccess(res, 200, result, `Comment ${result.action} successfully`);
});

/**
 * @desc    Get user's like status for a video
 * @route   GET /api/videos/:videoId/like-status
 * @access  Private
 */
export const getVideoLikeStatus = catchAsync(async (req, res, next) => {
  const likeStatus = await Like.checkUserLike(req.user.id, req.params.videoId, 'video');

  sendSuccess(
    res,
    200,
    { likeStatus },
    'Like status retrieved successfully'
  );
});

export default {
  toggleVideoLike,
  toggleVideoDislike,
  toggleCommentLike,
  getVideoLikeStatus,
};
