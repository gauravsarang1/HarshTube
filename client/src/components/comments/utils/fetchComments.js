import axios from 'axios';
import { setComments, setLoading, setError } from '../../../features/body/commentSlice';

export async function fetchComments({ videoId, dispatch, navigate }) {
  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await axios.get(`http://localhost:5050/api/v1/comments/all/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
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