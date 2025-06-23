import api from '../../../api/axios';

export const userApi = {
  getProfile: (username) => api.get(`/users/c/${username}`),
  
  updateFullName: (fullName) => {
    const formData = new FormData();
    formData.append('fullName', fullName.trim());
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
  }
}; 