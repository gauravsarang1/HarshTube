import axios from 'axios';
import { setComments, setCommentlikedUser } from '../../../features/body/commentSlice';

export async function toggleCommentReaction(commentId, comments, commentlikedUser, dispatch, navigate) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const response = await axios.post(
      `http://localhost:5050/api/v1/likes/toggle/c/${commentId}`,
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