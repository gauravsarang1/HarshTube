import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api/v1';

export const fetchVideos = async (page, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos/all-videos?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}; 