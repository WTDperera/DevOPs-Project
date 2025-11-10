/**
 * ==============================================
 * LIKE MODEL
 * ==============================================
 * 
 * Mongoose schema for Like/Dislike collection
 * Handles likes for videos and comments
 */

import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    // User who liked/disliked
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Like must belong to a user'],
      index: true,
    },

    // Target of the like (video or comment)
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      index: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      index: true,
    },

    // Type of interaction
    type: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only like/dislike a video or comment once
likeSchema.index({ user: 1, video: 1 }, { unique: true, sparse: true });
likeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });

// Compound indexes for queries
likeSchema.index({ video: 1, type: 1 });
likeSchema.index({ comment: 1, type: 1 });

// Validation: Must have either video or comment, not both
likeSchema.pre('save', function (next) {
  if ((this.video && this.comment) || (!this.video && !this.comment)) {
    next(new Error('Like must be associated with either a video or comment, not both'));
  }
  next();
});

// Post-save middleware to update counts
likeSchema.post('save', async function () {
  if (this.video) {
    const Video = mongoose.model('Video');
    await Video.findByIdAndUpdate(this.video).then((video) => {
      if (video) video.updateEngagement();
    });
  }

  if (this.comment) {
    const Comment = mongoose.model('Comment');
    const likesCount = await mongoose
      .model('Like')
      .countDocuments({ comment: this.comment, type: 'like' });
    await Comment.findByIdAndUpdate(this.comment, { likesCount });
  }
});

// Post-remove middleware to update counts
likeSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    if (doc.video) {
      const Video = mongoose.model('Video');
      await Video.findByIdAndUpdate(doc.video).then((video) => {
        if (video) video.updateEngagement();
      });
    }

    if (doc.comment) {
      const Comment = mongoose.model('Comment');
      const likesCount = await mongoose
        .model('Like')
        .countDocuments({ comment: doc.comment, type: 'like' });
      await Comment.findByIdAndUpdate(doc.comment, { likesCount });
    }
  }
});

// Static method to toggle like
likeSchema.statics.toggleLike = async function (userId, targetId, targetType, likeType = 'like') {
  const query = { user: userId };
  query[targetType] = targetId;

  const existingLike = await this.findOne(query);

  if (existingLike) {
    // If same type, remove the like
    if (existingLike.type === likeType) {
      await this.findByIdAndDelete(existingLike._id);
      return { action: 'removed', type: likeType };
    }
    // If different type, update it
    existingLike.type = likeType;
    await existingLike.save();
    return { action: 'updated', type: likeType };
  }

  // Create new like
  const newLike = await this.create({
    user: userId,
    [targetType]: targetId,
    type: likeType,
  });

  return { action: 'created', type: likeType, data: newLike };
};

// Static method to check if user liked a target
likeSchema.statics.checkUserLike = async function (userId, targetId, targetType) {
  const query = { user: userId };
  query[targetType] = targetId;

  const like = await this.findOne(query);
  return like ? like.type : null;
};

// Static method to get users who liked a target
likeSchema.statics.getLikers = function (targetId, targetType, options = {}) {
  const { page = 1, limit = 20, type = 'like' } = options;
  const skip = (page - 1) * limit;

  const query = { [targetType]: targetId, type };

  return this.find(query)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('user', 'username fullName avatar');
};

const Like = mongoose.model('Like', likeSchema);

export default Like;
