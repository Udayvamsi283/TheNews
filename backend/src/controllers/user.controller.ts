import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import {
  updateProfileSchema,
  changePasswordSchema,
  adminUpdateUserSchema
} from '../validators/user.validator.js';

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).populate('interests', 'name slug');
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      {
        $set: {
          ...(validatedData.name && { name: validatedData.name }),
          ...(validatedData.avatar !== undefined && { avatar: validatedData.avatar }),
          ...(validatedData.preferredLanguage && { preferredLanguage: validatedData.preferredLanguage }),
          ...(validatedData.interests && { interests: validatedData.interests })
        }
      },
      { new: true, runValidators: true }
    ).populate('interests', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    const user = await User.findById(req.user!._id).select('+passwordHash');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// Admin user management controllers
export const listUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const search = (req.query.search as string)?.trim();
    const role = req.query.role as string;
    const status = req.query.status as string;

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && ['user', 'admin'].includes(role)) {
      query.role = role;
    }

    if (status && ['active', 'disabled'].includes(status)) {
      query.status = status;
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).populate('interests', 'name slug');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = adminUpdateUserSchema.parse(req.body);

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Prevent admin from disabling or demoting their own account
    if (targetUser._id.equals(req.user!._id)) {
      if (validatedData.status === 'disabled' || validatedData.role === 'user') {
        res.status(400).json({
          success: false,
          message: 'Security protection: You cannot disable or demote your own admin account.'
        });
        return;
      }
    }

    if (validatedData.role) targetUser.role = validatedData.role;
    if (validatedData.status) targetUser.status = validatedData.status;

    await targetUser.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: { user: targetUser }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    // Prevent admin from deleting themselves
    if (targetUser._id.equals(req.user!._id)) {
      res.status(400).json({
        success: false,
        message: 'Security protection: You cannot delete your own admin account.'
      });
      return;
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
