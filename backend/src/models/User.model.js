/**
 * ==============================================
 * USER MODEL
 * ==============================================
 * 
 * Mongoose schema for User collection
 * Handles user authentication, profile, and relationships
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import CONSTANTS from '../config/constants.js';

const userSchema = new mongoose.Schema(
  {
    // Authentication fields
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [
        CONSTANTS.REGEX.USERNAME,
        'Username can only contain letters, numbers, and underscores',
      ],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [CONSTANTS.REGEX.EMAIL, 'Please provide a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },

    // Profile fields
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [50, 'Full name cannot exceed 50 characters'],
    },
    avatar: {
      type: String,
      default: 'default-avatar.png',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },

    // Channel information
    channelName: {
      type: String,
      trim: true,
      maxlength: [50, 'Channel name cannot exceed 50 characters'],
    },
    channelDescription: {
      type: String,
      maxlength: [1000, 'Channel description cannot exceed 1000 characters'],
      default: '',
    },

    // User role and status
    role: {
      type: String,
      enum: Object.values(CONSTANTS.USER_ROLES),
      default: CONSTANTS.USER_ROLES.USER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Statistics
    subscribersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    subscribedToCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalVideos: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Social links
    socialLinks: {
      website: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
    },

    // Preferences
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      privateProfile: { type: Boolean, default: false },
    },

    // Security
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: String,
    verificationExpires: Date,

    // Tracking
    lastLoginAt: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
userSchema.index({ username: 1, email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ subscribersCount: -1 });

// Virtual for user's videos
userSchema.virtual('videos', {
  ref: 'Video',
  localField: '_id',
  foreignField: 'owner',
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  // Only hash password if it has been modified
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    // Update passwordChangedAt
    if (!this.isNew) {
      this.passwordChangedAt = Date.now() - 1000;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to increment login count
userSchema.methods.recordLogin = async function () {
  this.loginCount += 1;
  this.lastLoginAt = Date.now();
  await this.save({ validateBeforeSave: false });
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    return null;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return null;
  }

  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
