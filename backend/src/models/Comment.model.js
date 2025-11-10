/**
 * ==============================================
 * COMMENT MODEL
 * ==============================================
 * 
 * Mongoose schema for Comment collection
 * Supports nested replies and moderation
 */

import mongoose from 'mongoose';
import CONSTANTS from '../config/constants.js';

const commentSchema = new mongoose.Schema(
  {
    // Comment content
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },

    // Relationships
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: [true, 'Comment must belong to a video'],
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must have an author'],
      index: true,
    },

    // Nested replies support
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true,
    },
    replyToUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Status and moderation
    status: {
      type: String,
      enum: Object.values(CONSTANTS.COMMENT_STATUS),
      default: CONSTANTS.COMMENT_STATUS.ACTIVE,
      index: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,

    // Engagement
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Moderation
    reportCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isHighlighted: {
      type: Boolean,
      default: false, // Highlighted by video owner
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
commentSchema.index({ video: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });
commentSchema.index({ video: 1, parentComment: 1, status: 1 });

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
});

// Virtual for likes
commentSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'comment',
});

// Pre-save middleware to mark as edited
commentSchema.pre('save', function (next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = Date.now();
  }
  next();
});

// Post-save middleware to update video comment count
commentSchema.post('save', async function () {
  if (this.status === CONSTANTS.COMMENT_STATUS.ACTIVE) {
    await this.model('Video').findByIdAndUpdate(this.video, {
      $inc: { commentsCount: 1 },
    });

    // Update parent comment reply count
    if (this.parentComment) {
      await this.model('Comment').findByIdAndUpdate(this.parentComment, {
        $inc: { repliesCount: 1 },
      });
    }
  }
});

// Post-remove middleware to update counts
commentSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await mongoose.model('Video').findByIdAndUpdate(doc.video, {
      $inc: { commentsCount: -1 },
    });

    if (doc.parentComment) {
      await mongoose.model('Comment').findByIdAndUpdate(doc.parentComment, {
        $inc: { repliesCount: -1 },
      });
    }

    // Delete all replies to this comment
    await mongoose.model('Comment').deleteMany({ parentComment: doc._id });
  }
});

// Instance method to check if user is author
commentSchema.methods.isAuthor = function (userId) {
  return this.author.toString() === userId.toString();
};

// Static method to get top-level comments for a video
commentSchema.statics.getVideoComments = function (videoId, options = {}) {
  const { page = 1, limit = 20, sort = '-createdAt' } = options;
  const skip = (page - 1) * limit;

  return this.find({
    video: videoId,
    parentComment: null,
    status: CONSTANTS.COMMENT_STATUS.ACTIVE,
  })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('author', 'username fullName avatar')
    .populate({
      path: 'replies',
      match: { status: CONSTANTS.COMMENT_STATUS.ACTIVE },
      options: { sort: 'createdAt', limit: 3 },
      populate: {
        path: 'author',
        select: 'username fullName avatar',
      },
    });
};

// Static method to get comment replies
commentSchema.statics.getCommentReplies = function (parentId, options = {}) {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  return this.find({
    parentComment: parentId,
    status: CONSTANTS.COMMENT_STATUS.ACTIVE,
  })
    .sort('createdAt')
    .skip(skip)
    .limit(limit)
    .populate('author', 'username fullName avatar')
    .populate('replyToUser', 'username');
};

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
