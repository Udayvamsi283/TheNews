import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  listUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Authenticated current user routes
router.get('/me', authenticate, getProfile);
router.patch('/me', authenticate, updateProfile);
router.post('/me/change-password', authenticate, changePassword);

// Admin-only user management routes
router.get('/', authenticate, requireRole('admin'), listUsers);
router.get('/:id', authenticate, requireRole('admin'), getUserById);
router.patch('/:id', authenticate, requireRole('admin'), updateUser);
router.delete('/:id', authenticate, requireRole('admin'), deleteUser);

export default router;
