/**
 * ==============================================
 * ASYNC ERROR HANDLER WRAPPER
 * ==============================================
 * 
 * Utility function to wrap async route handlers
 * and catch errors to pass to error middleware
 */

/**
 * Catches async errors and passes them to Express error handler
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
