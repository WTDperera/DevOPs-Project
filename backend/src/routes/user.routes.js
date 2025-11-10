/**
 * ==============================================
 * USER ROUTES
 * ==============================================
 * 
 * Routes for user profile endpoints
 */

import express from 'express';
import {
  getUserById,
  getUserByUsername,
  getAllUsers,
  updateAvatar,
  getUserChannel,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../config/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/username/:username', getUserByUsername);
router.get('/:id/channel', getUserChannel);

// Protected routes
router.put('/avatar', protect, uploadImage.single('avatar'), updateAvatar);

export default router;
