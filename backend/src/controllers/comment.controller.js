/**
 * ==============================================
 * COMMENT CONTROLLER
 * ==============================================
 * 
 * Handles all comment-related operations
 */

import Comment from '../models/Comment.model.js';
import Video from '../models/Video.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import { getPaginationParams, getPaginationMetadata } from '../utils/pagination.js';
import CONSTANTS from '../config/constants.js';

/**
 * @desc    Get comments for a video
 * @route   GET /api/videos/:videoId/comments
 * @access  Public
 */
export const getVideoComments = catchAsync(async (req, res, next) => {
  const { page, limit } = getPaginationParams(req.query);
  const { sort } = req.query;

  const comments = await Comment.getVideoComments(req.params.videoId, {
    page,
    limit,
    sort: sort || '-createdAt',
  });

  const totalComments = await Comment.countDocuments({
    video: req.params.videoId,
    parentComment: null,
    status: CONSTANTS.COMMENT_STATUS.ACTIVE,
  });

  const pagination = getPaginationMetadata(totalComments, page, limit);

  sendPaginated(res, 200, comments, pagination, 'Comments retrieved successfully');
});

/**
 * @desc    Create a comment
 * @route   POST /api/videos/:videoId/comments
 * @access  Private
 */
export const createComment = catchAsync(async (req, res, next) => {
  const { content, parentComment } = req.body;

  // Check if video exists
  const video = await Video.findById(req.params.videoId);
  if (!video) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.VIDEO_NOT_FOUND, 404));
  }

  // Check if comments are allowed
  if (!video.allowComments) {
    return next(new AppError('Comments are disabled for this video', 403));
  }

  // If it's a reply, verify parent comment exists
  if (parentComment) {
    const parent = await Comment.findById(parentComment);
    if (!parent) {
      return next(new AppError('Parent comment not found', 404));
    }
  }

  const comment = await Comment.create({
    content,
    video: req.params.videoId,
    author: req.user.id,
    parentComment: parentComment || null,
  });

  await comment.populate('author', 'username fullName avatar');

  sendSuccess(res, 201, { comment }, CONSTANTS.SUCCESS_MESSAGES.COMMENT_POST_SUCCESS);
});

/**
 * @desc    Update a comment
 * @route   PUT /api/comments/:id
 * @access  Private
 */
export const updateComment = catchAsync(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.COMMENT_NOT_FOUND, 404));
  }

  // Check if user is the author
  if (comment.author.toString() !== req.user.id) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED, 403));
  }

  comment.content = req.body.content;
  await comment.save();

  await comment.populate('author', 'username fullName avatar');

  sendSuccess(res, 200, { comment }, 'Comment updated successfully');
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
export const deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.COMMENT_NOT_FOUND, 404));
  }

  // Check if user is the author or admin
  if (
    comment.author.toString() !== req.user.id &&
    req.user.role !== CONSTANTS.USER_ROLES.ADMIN
  ) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED, 403));
  }

  await comment.deleteOne();

  sendSuccess(res, 200, null, CONSTANTS.SUCCESS_MESSAGES.COMMENT_DELETE_SUCCESS);
});

/**
 * @desc    Get replies for a comment
 * @route   GET /api/comments/:id/replies
 * @access  Public
 */
export const getCommentReplies = catchAsync(async (req, res, next) => {
  const { page, limit } = getPaginationParams(req.query);

  const replies = await Comment.getCommentReplies(req.params.id, { page, limit });

  const totalReplies = await Comment.countDocuments({
    parentComment: req.params.id,
    status: CONSTANTS.COMMENT_STATUS.ACTIVE,
  });

  const pagination = getPaginationMetadata(totalReplies, page, limit);

  sendPaginated(res, 200, replies, pagination, 'Replies retrieved successfully');
});

export default {
  getVideoComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentReplies,
};
