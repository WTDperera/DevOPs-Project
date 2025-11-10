/**
 * ==============================================
 * AUTH ROUTES
 * ==============================================
 * 
 * Routes for authentication endpoints
 */

import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updatePassword,
  updateProfile,
  deleteAccount,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import {
  registerValidator,
  loginValidator,
  updatePasswordValidator,
} from '../validators/auth.validator.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

// Protected routes
router.use(protect); // All routes below require authentication

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/update-password', updatePasswordValidator, validate, updatePassword);
router.put('/update-profile', updateProfile);
router.delete('/delete-account', deleteAccount);

export default router;
