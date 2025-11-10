/**
 * ==============================================
 * VIDEO CONTROLLER
 * ==============================================
 * 
 * Handles all video-related operations
 */

import Video from '../models/Video.model.js';
import User from '../models/User.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import { getPaginationParams, getPaginationMetadata } from '../utils/pagination.js';
import CONSTANTS from '../config/constants.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Upload a new video
 * @route   POST /api/videos/upload
 * @access  Private
 */
export const uploadVideo = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a video file', 400));
  }

  const { title, description, category, privacy, tags } = req.body;

  // Parse tags if it's a string
  let parsedTags = tags;
  if (typeof tags === 'string') {
    parsedTags = tags.split(',').map((tag) => tag.trim());
  }

  // Create video document
  const video = await Video.create({
    title,
    description,
    category: category || 'Other',
    privacy: privacy || CONSTANTS.VIDEO_PRIVACY.PUBLIC,
    tags: parsedTags || [],
    videoFile: req.file.filename,
    fileSize: req.file.size,
    format: req.file.mimetype,
    duration: 0, // Will be updated by video processing
    owner: req.user.id,
    status: CONSTANTS.VIDEO_STATUS.PROCESSING,
  });

  // Update user's video count
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { totalVideos: 1 },
  });

  // TODO: Trigger video processing job here

  sendSuccess(res, 201, { video }, CONSTANTS.SUCCESS_MESSAGES.VIDEO_UPLOAD_SUCCESS);
});

/**
 * @desc    Get all videos with pagination and filtering
 * @route   GET /api/videos
 * @access  Public
 */
export const getAllVideos = catchAsync(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { sort, category, search } = req.query;

  // Build query
  const query = {
    privacy: CONSTANTS.VIDEO_PRIVACY.PUBLIC,
    status: CONSTANTS.VIDEO_STATUS.READY,
    isPublished: true,
  };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  // Execute query with pagination
  const videos = await Video.find(query)
    .sort(sort || '-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('owner', 'username fullName avatar subscribersCount')
    .select('-processedVersions');

  const totalVideos = await Video.countDocuments(query);
  const pagination = getPaginationMetadata(totalVideos, page, limit);

  sendPaginated(res, 200, videos, pagination, 'Videos retrieved successfully');
});

/**
 * @desc    Get single video by ID
 * @route   GET /api/videos/:id
 * @access  Public
 */
export const getVideoById = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id)
    .populate('owner', 'username fullName avatar subscribersCount channelName')
    .populate({
      path: 'comments',
      match: { parentComment: null, status: 'active' },
      options: { sort: '-createdAt', limit: 10 },
      populate: {
        path: 'author',
        select: 'username fullName avatar',
      },
    });

  if (!video) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.VIDEO_NOT_FOUND, 404));
  }

  // Check if video is private
  if (video.privacy === CONSTANTS.VIDEO_PRIVACY.PRIVATE) {
    if (!req.user || video.owner._id.toString() !== req.user.id) {
      return next(new AppError('This video is private', 403));
    }
  }

  // Increment views (only if not the owner)
  if (!req.user || video.owner._id.toString() !== req.user.id) {
    await video.incrementViews();
  }

  sendSuccess(res, 200, { video }, 'Video retrieved successfully');
});

/**
 * @desc    Update video
 * @route   PUT /api/videos/:id
 * @access  Private
 */
export const updateVideo = catchAsync(async (req, res, next) => {
  let video = await Video.findById(req.params.id);

  if (!video) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.VIDEO_NOT_FOUND, 404));
  }

  // Check ownership
  if (video.owner.toString() !== req.user.id && req.user.role !== CONSTANTS.USER_ROLES.ADMIN) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED, 403));
  }

  const allowedFields = [
    'title',
    'description',
    'category',
    'privacy',
    'tags',
    'allowComments',
    'allowLikes',
  ];

  const updates = Object.keys(req.body)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  video = await Video.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate('owner', 'username fullName avatar');

  sendSuccess(res, 200, { video }, CONSTANTS.SUCCESS_MESSAGES.VIDEO_UPDATE_SUCCESS);
});

/**
 * @desc    Delete video
 * @route   DELETE /api/videos/:id
 * @access  Private
 */
export const deleteVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.VIDEO_NOT_FOUND, 404));
  }

  // Check ownership
  if (video.owner.toString() !== req.user.id && req.user.role !== CONSTANTS.USER_ROLES.ADMIN) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED, 403));
  }

  // Delete video file
  const videoPath = path.join(__dirname, '../../uploads/videos', video.videoFile);
  if (fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
  }

  // Delete video document
  await video.deleteOne();

  // Update user's video count
  await User.findByIdAndUpdate(video.owner, {
    $inc: { totalVideos: -1 },
  });

  sendSuccess(res, 200, null, CONSTANTS.SUCCESS_MESSAGES.VIDEO_DELETE_SUCCESS);
});

/**
 * @desc    Get trending videos
 * @route   GET /api/videos/trending
 * @access  Public
 */
export const getTrendingVideos = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20;

  const videos = await Video.getTrending(limit);

  sendSuccess(res, 200, { videos }, 'Trending videos retrieved successfully');
});

/**
 * @desc    Get recommended videos
 * @route   GET /api/videos/:id/recommended
 * @access  Public
 */
export const getRecommendedVideos = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.VIDEO_NOT_FOUND, 404));
  }

  const limit = parseInt(req.query.limit) || 10;
  const videos = await Video.getRecommended(video.category, video._id, limit);

  sendSuccess(res, 200, { videos }, 'Recommended videos retrieved successfully');
});

/**
 * @desc    Get user's videos
 * @route   GET /api/videos/user/:userId
 * @access  Public
 */
export const getUserVideos = catchAsync(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const query = {
    owner: req.params.userId,
    isPublished: true,
  };

  // If not the owner, only show public videos
  if (!req.user || req.user.id !== req.params.userId) {
    query.privacy = CONSTANTS.VIDEO_PRIVACY.PUBLIC;
    query.status = CONSTANTS.VIDEO_STATUS.READY;
  }

  const videos = await Video.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('owner', 'username fullName avatar');

  const totalVideos = await Video.countDocuments(query);
  const pagination = getPaginationMetadata(totalVideos, page, limit);

  sendPaginated(res, 200, videos, pagination, 'User videos retrieved successfully');
});

export default {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getTrendingVideos,
  getRecommendedVideos,
  getUserVideos,
};
