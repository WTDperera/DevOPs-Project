/**
 * ==============================================
 * USER CONTROLLER
 * ==============================================
 * 
 * Handles user profile and channel operations
 */

import User from '../models/User.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import { getPaginationParams, getPaginationMetadata } from '../utils/pagination.js';
import CONSTANTS from '../config/constants.js';

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }

  sendSuccess(res, 200, { user }, 'User retrieved successfully');
});

/**
 * @desc    Get user profile by username
 * @route   GET /api/users/username/:username
 * @access  Public
 */
export const getUserByUsername = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username }).select('-password');

  if (!user) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }

  sendSuccess(res, 200, { user }, 'User retrieved successfully');
});

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Public
 */
export const getAllUsers = catchAsync(async (req, res, next) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { search, sort } = req.query;

  const query = { isActive: true };

  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { fullName: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort(sort || '-createdAt')
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(query);
  const pagination = getPaginationMetadata(totalUsers, page, limit);

  sendPaginated(res, 200, users, pagination, 'Users retrieved successfully');
});

/**
 * @desc    Update user avatar
 * @route   PUT /api/users/avatar
 * @access  Private
 */
export const updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image file', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.file.filename },
    { new: true, runValidators: true }
  ).select('-password');

  sendSuccess(res, 200, { user }, 'Avatar updated successfully');
});

/**
 * @desc    Get user channel
 * @route   GET /api/users/:id/channel
 * @access  Public
 */
export const getUserChannel = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('username fullName avatar channelName channelDescription subscribersCount totalVideos totalViews')
    .populate({
      path: 'videos',
      match: { isPublished: true, privacy: 'public' },
      options: { sort: '-createdAt', limit: 12 },
      select: 'title thumbnail views duration createdAt',
    });

  if (!user) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.USER_NOT_FOUND, 404));
  }

  sendSuccess(res, 200, { channel: user }, 'Channel retrieved successfully');
});

export default {
  getUserById,
  getUserByUsername,
  getAllUsers,
  updateAvatar,
  getUserChannel,
};
