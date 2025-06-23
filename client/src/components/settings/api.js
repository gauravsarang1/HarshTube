import api from '../../api/axios';

export const logoutUser = async () => {
  try {
    await api.post('/users/logout');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}; 

const userApi = {
    fetchUserData: async () => {
        const response = await api.get('/users/me');
        return response.data.data;
    },

    getUserVideos: async (page = 1) => {
        const response = await api.get('/videos/all-uploaded-videos', {
            params: { page }
        });
        return response.data.data;
    },

    deleteVideo: async (videoId) => {
        const response = await api.delete(`/videos/delete/${videoId}`);
        return response;
    },

    deleteAllVideos: async () => {
        const response = await api.delete('/videos');
        return response;
    },

    updateUserProfile: (profileData) => {
      const formData = new FormData();
      formData.append('fullName', profileData.fullName.trim());
      formData.append('email', profileData.email.trim());
      formData.append('username', profileData.username.trim());

      if(!formData.get('fullName') || !formData.get('email')) {
        return Promise.reject({
          status: 400,
          message: 'Full name and email are required',
        });
      }

      return api.post('/users/update-all-details', formData);
    },
    
    updateCoverImage: (coverImage) => {
      const formData = new FormData();
      formData.append('coverImage', coverImage);
      return api.post('/users/update-coverImage', formData);
    },
    
    updateAvatar: (avatar) => {
      const formData = new FormData();
      formData.append('avatar', avatar);
      return api.post('/users/update-avatar', formData);
    },

    updateUserPassword: (currentPassword, newPassword) => {
      const formData = new FormData();
      formData.append('currentPassword', currentPassword?.trim());
      formData.append('newPassword', newPassword?.trim());
      return api.post('/users/update-password', formData);
    },
  };
  
  export default userApi; 

