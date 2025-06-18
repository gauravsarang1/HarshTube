import { setNewComment, setSubmitType } from '../../../features/body/commentSlice';

export function handleEditComment(commentId, comments, dispatch) {
  try {
    const commentToEdit = comments.find(c => c._id === commentId);
    if (commentToEdit) {
      dispatch(setNewComment(commentToEdit.content));
      dispatch(setSubmitType({type: 'edit', commentId}));
    }
  } catch (err) {
    console.error('Error preparing to edit comment:', err);
  }
} 