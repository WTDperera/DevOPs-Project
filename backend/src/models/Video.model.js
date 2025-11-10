/**
 * ==============================================
 * VIDEO MODEL
 * ==============================================
 * 
 * Mongoose schema for Video collection
 * Handles video metadata, status, and relationships
 */

import mongoose from 'mongoose';
import slugify from 'slugify';
import CONSTANTS from '../config/constants.js';

const videoSchema = new mongoose.Schema(
  {
    // Basic information
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      index: 'text',
    },
    description: {
      type: String,
      required: [true, 'Video description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
      index: 'text',
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    // File information
    videoFile: {
      type: String,
      required: [true, 'Video file is required'],
    },
    thumbnail: {
      type: String,
      default: 'default-thumbnail.jpg',
    },
    duration: {
      type: Number, // in seconds
      required: true,
      min: 0,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    resolution: {
      width: Number,
      height: Number,
    },
    format: {
      type: String,
      required: true,
    },

    // Processed versions (for adaptive streaming)
    processedVersions: [
      {
        quality: {
          type: String,
          enum: ['1080p', '720p', '480p', '360p'],
        },
        url: String,
        fileSize: Number,
      },
    ],

    // Owner information
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Video must belong to a user'],
      index: true,
    },

    // Video status and privacy
    status: {
      type: String,
      enum: Object.values(CONSTANTS.VIDEO_STATUS),
      default: CONSTANTS.VIDEO_STATUS.PROCESSING,
    },
    privacy: {
      type: String,
      enum: Object.values(CONSTANTS.VIDEO_PRIVACY),
      default: CONSTANTS.VIDEO_PRIVACY.PUBLIC,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },

    // Categorization
    category: {
      type: String,
      enum: [
        'Education',
        'Entertainment',
        'Gaming',
        'Music',
        'Sports',
        'Technology',
        'Travel',
        'Lifestyle',
        'News',
        'Other',
      ],
      default: 'Other',
      index: true,
    },
    tags: {
      type: [String],
      validate: {
        validator: function (tags) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
      },
      index: true,
    },

    // Engagement metrics
    views: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    dislikesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Trending score (calculated field)
    trendingScore: {
      type: Number,
      default: 0,
      index: true,
    },

    // Settings
    allowComments: {
      type: Boolean,
      default: true,
    },
    allowLikes: {
      type: Boolean,
      default: true,
    },
    ageRestricted: {
      type: Boolean,
      default: false,
    },

    // Analytics
    watchTime: {
      type: Number, // total watch time in seconds
      default: 0,
    },
    averageViewDuration: {
      type: Number, // in seconds
      default: 0,
    },
    uniqueViewers: {
      type: Number,
      default: 0,
    },

    // Language and accessibility
    language: {
      type: String,
      default: 'en',
    },
    subtitles: [
      {
        language: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for common queries
videoSchema.index({ owner: 1, createdAt: -1 });
videoSchema.index({ privacy: 1, status: 1, isPublished: 1 });
videoSchema.index({ category: 1, views: -1 });
videoSchema.index({ tags: 1, views: -1 });
videoSchema.index({ trendingScore: -1, createdAt: -1 });

// Text index for search
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for comments
videoSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'video',
});

// Virtual for likes
videoSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'video',
});

// Pre-save middleware to generate slug
videoSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
    // Add timestamp to ensure uniqueness
    this.slug += `-${Date.now()}`;
  }
  next();
});

// Pre-save middleware to calculate trending score
videoSchema.pre('save', function (next) {
  if (this.isModified('views') || this.isModified('likesCount')) {
    const ageInHours = (Date.now() - this.createdAt) / (1000 * 60 * 60);
    const viewScore = this.views * 1;
    const likeScore = this.likesCount * 5;
    const commentScore = this.commentsCount * 3;
    const recencyBoost = Math.max(0, 100 - ageInHours);

    this.trendingScore = viewScore + likeScore + commentScore + recencyBoost;
  }
  next();
});

// Instance method to increment view count
videoSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save({ validateBeforeSave: false });
};

// Instance method to update engagement metrics
videoSchema.methods.updateEngagement = async function () {
  const Like = mongoose.model('Like');
  const Comment = mongoose.model('Comment');

  this.likesCount = await Like.countDocuments({ video: this._id, type: 'like' });
  this.dislikesCount = await Like.countDocuments({ video: this._id, type: 'dislike' });
  this.commentsCount = await Comment.countDocuments({ video: this._id, status: 'active' });

  await this.save({ validateBeforeSave: false });
};

// Static method to get trending videos
videoSchema.statics.getTrending = function (limit = 10) {
  return this.find({
    privacy: CONSTANTS.VIDEO_PRIVACY.PUBLIC,
    status: CONSTANTS.VIDEO_STATUS.READY,
    isPublished: true,
  })
    .sort('-trendingScore -views')
    .limit(limit)
    .populate('owner', 'username fullName avatar');
};

// Static method to get recommended videos
videoSchema.statics.getRecommended = function (category, excludeId, limit = 10) {
  return this.find({
    _id: { $ne: excludeId },
    category,
    privacy: CONSTANTS.VIDEO_PRIVACY.PUBLIC,
    status: CONSTANTS.VIDEO_STATUS.READY,
    isPublished: true,
  })
    .sort('-views -likesCount')
    .limit(limit)
    .populate('owner', 'username fullName avatar');
};

const Video = mongoose.model('Video', videoSchema);

export default Video;
