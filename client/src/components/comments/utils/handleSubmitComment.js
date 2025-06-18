import axios from 'axios';
import { setSubmitting, setComments, setNewComment, setSubmitType, setError } from '../../../features/body/commentSlice';

export async function handleSubmitComment(e, newComment, submitType, videoId, dispatch, navigate, comments) {
  e.preventDefault();
  if (!newComment.trim()) return;
  console.log('videoId', videoId);
  try {
    dispatch(setSubmitting(true));
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (submitType.type === 'edit') {
      await axios.patch(
        `http://localhost:5050/api/v1/comments/update/${submitType.commentId}`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      dispatch(setComments(comments.map(comment => 
        comment._id === submitType.commentId 
          ? { ...comment, content: newComment }
          : comment
      )));
      dispatch(setSubmitType({type: 'send', commentId: null}));
      dispatch(setNewComment(''));
      return;
    }
    const response = await axios.post(
      `http://localhost:5050/api/v1/comments/add/${videoId}`,
      { content: newComment },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch(setComments([response.data.data, ...comments]));
    dispatch(setNewComment(''));
    dispatch(setError(null));
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      dispatch(setError('Failed to post comment. Please try again later.'));
      console.error('Error posting comment:', err);
    }
  } finally {
    dispatch(setSubmitting(false));
    if (submitType.type === 'edit') {
      dispatch(setSubmitType({type: 'send', commentId: null}));
    }
  }
} 