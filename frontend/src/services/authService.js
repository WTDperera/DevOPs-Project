import apiClient from './apiClient';

const authService = {
  // Register a new user
  register: async (userData) => {
    return await apiClient.post('/auth/register', userData);
  },

  // Login user
  login: async (credentials) => {
    return await apiClient.post('/auth/login', credentials);
  },

  // Logout user
  logout: async () => {
    return await apiClient.post('/auth/logout');
  },

  // Get current user
  getMe: async () => {
    return await apiClient.get('/auth/me');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await apiClient.put('/auth/update-profile', profileData);
  },

  // Update password
  updatePassword: async (passwordData) => {
    return await apiClient.put('/auth/update-password', passwordData);
  },

  // Delete account
  deleteAccount: async (password) => {
    return await apiClient.delete('/auth/delete-account', {
      data: { password },
    });
  },
};

export default authService;
