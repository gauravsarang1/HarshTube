import axios from 'axios';
import { setComments, setCommentlikedUser } from '../../../features/body/commentSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

export async function toggleCommentReaction(commentId, comments, commentlikedUser, dispatch, navigate) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await axios.post(
      `${API_BASE_URL}/likes/toggle/c/${commentId}`,
      { },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const { type } = response.data.data;
    dispatch(setComments(comments.map(comment => {
      if (comment._id === commentId) {
        return {
          ...comment,
          isLiked: type === 'like',
          totalLikes: type === 'like' 
            ? (comment.totalLikes || 0) + 1 
            : Math.max((comment.totalLikes || 0) - 1, 0)
        };
      }
      return comment;
    })));
    if (type === 'unLike') {
      dispatch(setCommentlikedUser(commentlikedUser.filter(liked => liked.comment?._id !== commentId)));
    } else {
      dispatch(setCommentlikedUser([...commentlikedUser, response.data.data]));
    }
  } catch (err) {
    console.error('Error reacting to comment:', err);
  }
} 