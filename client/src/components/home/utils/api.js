import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

export const fetchVideos = async (page, token) => {
  try {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const response = await axios.get(`${API_BASE_URL}/videos/all-videos?page=${page}`, { headers });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}; 