import apiClient from './apiClient';

const likeService = {
  // Toggle video like
  toggleVideoLike: async (videoId) => {
    return await apiClient.post(`/likes/video/${videoId}/like`);
  },

  // Toggle video dislike
  toggleVideoDislike: async (videoId) => {
    return await apiClient.post(`/likes/video/${videoId}/dislike`);
  },

  // Get video like status
  getVideoLikeStatus: async (videoId) => {
    return await apiClient.get(`/likes/video/${videoId}/status`);
  },

  // Toggle comment like
  toggleCommentLike: async (commentId) => {
    return await apiClient.post(`/likes/comment/${commentId}/like`);
  },
};

export default likeService;
