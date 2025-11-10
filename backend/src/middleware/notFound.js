/**
 * ==============================================
 * NOT FOUND MIDDLEWARE
 * ==============================================
 * 
 * Handles 404 errors for undefined routes
 */

import AppError from '../utils/appError.js';

const notFound = (req, res, next) => {
  const error = new AppError(`Cannot find ${req.originalUrl} on this server!`, 404);
  next(error);
};

export default notFound;
