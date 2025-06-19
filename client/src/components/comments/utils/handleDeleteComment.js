import axios from 'axios';
import { setComments, setError } from '../../../features/body/commentSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

export async function handleDeleteComment(commentId, comments, dispatch, navigate) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    await axios.delete(
      `${API_BASE_URL}/comments/delete/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch(setComments(comments.filter(comment => comment._id !== commentId)));
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      dispatch(setError('Failed to delete comment. Please try again later.'));
      console.error('Error deleting comment:', err);
    }
  }
} 