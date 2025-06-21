import axios from 'axios';
import { setComments, setLoading, setError } from '../../../features/body/commentSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

export async function fetchComments({ videoId, dispatch, navigate }) {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.get(`${API_BASE_URL}/comments/all/${videoId}`, { headers });
    dispatch(setComments(response.data.data));
    dispatch(setError(null));
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      dispatch(setError('Failed to fetch comments. Please try again later.'));
      console.error('Error fetching comments:', err);
    }
  } finally {
    dispatch(setLoading(false));
  }
} 