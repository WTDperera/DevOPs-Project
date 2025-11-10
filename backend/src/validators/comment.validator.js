/**
 * ==============================================
 * COMMENT VALIDATORS
 * ==============================================
 * 
 * Validation rules for comment endpoints
 */

import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const createCommentValidator = [
  param('videoId').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid video ID');
    }
    return true;
  }),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),

  body('parentComment')
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid parent comment ID');
      }
      return true;
    }),
];

export const updateCommentValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid comment ID');
    }
    return true;
  }),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
];

export const commentIdValidator = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid comment ID');
    }
    return true;
  }),
];

export default {
  createCommentValidator,
  updateCommentValidator,
  commentIdValidator,
};
