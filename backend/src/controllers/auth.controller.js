/**
 * ==============================================
 * AUTHENTICATION CONTROLLER
 * ==============================================
 * 
 * Handles user registration, login, and authentication
 */

import User from '../models/User.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { sendTokenResponse } from '../utils/tokenUtils.js';
import { sendSuccess } from '../utils/response.js';
import CONSTANTS from '../config/constants.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = catchAsync(async (req, res, next) => {
  const { username, email, password, fullName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return next(new AppError(CONSTANTS.ERROR_MESSAGES.EMAIL_EXISTS, 400));
    }
    if (existingUser.username === username) {
      return next(new AppError(CONSTANTS.ERROR_MESSAGES.USERNAME_EXISTS, 400));
    }
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    fullName,
    channelName: fullName, // Default channel name to full name
  });

  // Send token response
  sendTokenResponse(user, 201, res, CONSTANTS.SUCCESS_MESSAGES.REGISTER_SUCCESS);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findByCredentials(email, password);

  if (!user) {
    return next(new AppError(CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS, 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated', 401));
  }

  // Record login
  await user.recordLogin();

  // Send token response
  sendTokenResponse(user, 200, res, CONSTANTS.SUCCESS_MESSAGES.LOGIN_SUCCESS);
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = catchAsync(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  sendSuccess(res, 200, null, CONSTANTS.SUCCESS_MESSAGES.LOGOUT_SUCCESS);
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  sendSuccess(res, 200, { user }, 'User retrieved successfully');
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Send token response
  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
export const updateProfile = catchAsync(async (req, res, next) => {
  const allowedFields = [
    'fullName',
    'bio',
    'channelName',
    'channelDescription',
    'socialLinks',
    'preferences',
  ];

  // Filter req.body to only include allowed fields
  const updates = Object.keys(req.body)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, 200, { user }, CONSTANTS.SUCCESS_MESSAGES.PROFILE_UPDATE_SUCCESS);
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/auth/delete-account
 * @access  Private
 */
export const deleteAccount = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Verify password before deletion
  const { password } = req.body;
  if (!password) {
    return next(new AppError('Please provide your password to delete your account', 400));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Password is incorrect', 401));
  }

  // Soft delete - deactivate account
  user.isActive = false;
  await user.save({ validateBeforeSave: false });

  // Clear cookie
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  sendSuccess(res, 200, null, 'Account deleted successfully');
});

export default {
  register,
  login,
  logout,
  getMe,
  updatePassword,
  updateProfile,
  deleteAccount,
};
