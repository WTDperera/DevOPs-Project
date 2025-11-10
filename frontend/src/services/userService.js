import apiClient from './apiClient';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const userService = {
  // Get user by ID
  getUserById: async (id) => {
    return await apiClient.get(`/users/${id}`);
  },

  // Get user by username
  getUserByUsername: async (username) => {
    return await apiClient.get(`/users/username/${username}`);
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    return await apiClient.get('/users', { params });
  },

  // Get user channel
  getUserChannel: async (id) => {
    return await apiClient.get(`/users/${id}/channel`);
  },

  // Update avatar
  updateAvatar: async (formData) => {
    const token = localStorage.getItem('token');
    
    return await axios.put(`${API_URL}/users/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default userService;
