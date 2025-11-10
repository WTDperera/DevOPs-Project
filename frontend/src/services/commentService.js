import apiClient from './apiClient';

const commentService = {
  // Get video comments
  getVideoComments: async (videoId, params = {}) => {
    return await apiClient.get(`/comments/video/${videoId}`, { params });
  },

  // Create comment
  createComment: async (videoId, commentData) => {
    return await apiClient.post(`/comments/video/${videoId}`, commentData);
  },

  // Update comment
  updateComment: async (id, content) => {
    return await apiClient.put(`/comments/${id}`, { content });
  },

  // Delete comment
  deleteComment: async (id) => {
    return await apiClient.delete(`/comments/${id}`);
  },

  // Get comment replies
  getCommentReplies: async (commentId, params = {}) => {
    return await apiClient.get(`/comments/${commentId}/replies`, { params });
  },
};

export default commentService;
