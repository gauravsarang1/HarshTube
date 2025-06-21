import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

{/*export const fetchUserData = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};*/}

export const logoutUser = async (token) => {
  try {
    await axios.post(`${API_BASE_URL}/users/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}; 

{/*const api = {
    get: async (endpoint, token, params = {}) => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          ...(params ? { params } : {})
        }
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers
        });
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
  };*/}
  
  const userApi = {
    fetchUserData: async (token) => {
        const response = await axios.get(`${API_BASE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.data;
    },

    getUserVideos: async (token, page = 1) => {
        const response = await axios.get(`${API_BASE_URL}/videos/all-uploaded-videos`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page }
        });
        return response.data.data;
    },

    deleteVideo: async (token, videoId) => {
        const response = await axios.delete(`${API_BASE_URL}/videos/delete/${videoId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    },

    deleteAllVideos: async (token) => {
        const response = await axios.delete(`${API_BASE_URL}/videos`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response;
    },

    updateUserProfile: (profileData, token) => {
      const formData = new FormData();
      formData.append('fullName', profileData.fullName.trim());
      formData.append('email', profileData.email.trim());
      formData.append('username', profileData.username.trim());

      console.log(formData.get('fullName'), formData.get('email'), formData.get('username'));

      if(formData.get('fullName') === '' || formData.get('email') === '') {
        return {
          status: 400,
          message: 'Full name and email are required',
          
        }
      }

      return axios.post(`${API_BASE_URL}/users/update-all-details`, formData, {
        headers: { Authorization: `Bearer ${token}`}
      });
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
    },

    updateUserPassword: (currentPassword, newPassword, token) => {
      const formData = new FormData();
      formData.append('currentPassword', currentPassword?.trim());
      formData.append('newPassword', newPassword?.trim());
      return axios.post(`${API_BASE_URL}/users/update-password`, formData, {
        headers: { Authorization: `Bearer ${token}`}
      });
    },
  };
  
  export default userApi; 

