/**
 * ==============================================
 * PAGINATION UTILITY
 * ==============================================
 * 
 * Helper functions for handling pagination
 */

import CONSTANTS from '../config/constants.js';

/**
 * Extract and validate pagination parameters
 * @param {Object} query - Request query parameters
 * @returns {Object} Validated pagination parameters
 */
export const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || CONSTANTS.PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    Math.max(1, parseInt(query.limit) || CONSTANTS.PAGINATION.DEFAULT_LIMIT),
    CONSTANTS.PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Calculate pagination metadata
 * @param {number} totalItems - Total number of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const getPaginationMetadata = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

/**
 * Apply pagination to a Mongoose query
 * @param {Object} query - Mongoose query
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Modified query
 */
export const applyPagination = (query, page, limit) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

export default {
  getPaginationParams,
  getPaginationMetadata,
  applyPagination,
};
