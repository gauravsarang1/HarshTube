import axios from 'axios';
import { setSubmitting, setComments, setNewComment, setSubmitType, setError } from '../../../features/body/commentSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

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
        `${API_BASE_URL}/comments/update/${submitType.commentId}`,
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
      `${API_BASE_URL}/comments/add/${videoId}`,
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