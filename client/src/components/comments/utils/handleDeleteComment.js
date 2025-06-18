import axios from 'axios';
import { setComments, setError } from '../../../features/body/commentSlice';

export async function handleDeleteComment(commentId, comments, dispatch, navigate) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    await axios.delete(
      `http://localhost:5050/api/v1/comments/delete/${commentId}`,
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