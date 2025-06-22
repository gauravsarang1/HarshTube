import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const api = {
  get: async (endpoint, token) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  post: async (endpoint, data, token, isFormData = false) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' })
      };
      
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export const userApi = {
  getProfile: (username, token) => api.get(`/users/c/${username}`, token),
  
  updateFullName: (fullName, token) => {
    const formData = new FormData();
    formData.append('fullName', fullName.trim());
    return api.post('/users/update-all-details', formData, token, true);
  },
  
  updateCoverImage: (coverImage, token) => {
    const formData = new FormData();
    formData.append('coverImage', coverImage);
    return api.post('/users/update-coverImage', formData, token, true);
  },
  
  updateAvatar: (avatar, token) => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return api.post('/users/update-avatar', formData, token, true);
  }
};

export default api; 