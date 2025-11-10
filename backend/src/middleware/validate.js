/**
 * ==============================================
 * VALIDATION MIDDLEWARE
 * ==============================================
 * 
 * Validates request data using express-validator
 */

import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

/**
 * Check validation results and send errors if any
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return sendError(res, 400, 'Validation failed', extractedErrors);
  }

  next();
};

export default validate;
