import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

export const fetchUserData = async (token) => {
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
};

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