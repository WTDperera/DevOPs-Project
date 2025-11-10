import apiClient from './apiClient';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const videoService = {
  // Get all videos with pagination and filters
  getAllVideos: async (params = {}) => {
    return await apiClient.get('/videos', { params });
  },

  // Get single video by ID
  getVideoById: async (id) => {
    return await apiClient.get(`/videos/${id}`);
  },

  // Get trending videos
  getTrending: async (limit = 20) => {
    return await apiClient.get('/videos/trending', { params: { limit } });
  },

  // Get recommended videos
  getRecommended: async (videoId, limit = 10) => {
    return await apiClient.get(`/videos/${videoId}/recommended`, {
      params: { limit },
    });
  },

  // Get user's videos
  getUserVideos: async (userId, params = {}) => {
    return await apiClient.get(`/videos/user/${userId}`, { params });
  },

  // Upload video with progress tracking
  uploadVideo: async (formData, onUploadProgress) => {
    const token = localStorage.getItem('token');
    
    return await axios.post(`${API_URL}/videos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress,
      timeout: 300000, // 5 minutes for large files
    });
  },

  // Update video
  updateVideo: async (id, videoData) => {
    return await apiClient.put(`/videos/${id}`, videoData);
  },

  // Delete video
  deleteVideo: async (id) => {
    return await apiClient.delete(`/videos/${id}`);
  },

  // Search videos
  searchVideos: async (query, params = {}) => {
    return await apiClient.get('/videos', {
      params: { search: query, ...params },
    });
  },
};

export default videoService;
