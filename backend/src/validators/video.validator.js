/**
 * ==============================================
 * VIDEO VALIDATORS
 * ==============================================
 * 
 * Validation rules for video endpoints
 */

import { body, param, query } from 'express-validator';
import CONSTANTS from '../config/constants.js';
import mongoose from 'mongoose';

export const createVideoValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Video title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Video description is required')
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),

  body('category')
    .optional()
    .isIn([
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
    ])
    .withMessage('Invalid category'),

  body('privacy')
    .optional()
    .isIn(Object.values(CONSTANTS.VIDEO_PRIVACY))
    .withMessage('Invalid privacy setting'),

  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with maximum 10 items'),

  body('tags.*').optional().trim().isLength({ min: 1, max: 30 }),
];

export const updateVideoValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid video ID');
    }
    return true;
  }),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Description must be between 1 and 5000 characters'),

  body('category')
    .optional()
    .isIn([
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
    ]),

  body('privacy').optional().isIn(Object.values(CONSTANTS.VIDEO_PRIVACY)),

  body('tags').optional().isArray({ max: 10 }),
];

export const videoIdValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid video ID');
    }
    return true;
  }),
];

export const getVideosValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sort')
    .optional()
    .isIn(['-createdAt', 'createdAt', '-views', '-likesCount', '-trendingScore'])
    .withMessage('Invalid sort option'),

  query('category')
    .optional()
    .isIn([
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
    ]),
];

export default {
  createVideoValidator,
  updateVideoValidator,
  videoIdValidator,
  getVideosValidator,
};
