import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleEditComment } from '../utils/handleEditComment';
import { handleDeleteComment } from '../utils/handleDeleteComment';
import { toggleCommentReaction } from '../utils/toggleCommentReaction';
import { setSubmitType, setNewComment } from '../../../features/body/commentSlice';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import CommentItem from './CommentItem';

const CommentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { comments, currentUser, submitType, commentlikedUser } = useSelector(state => state.comment);

  const onEdit = (commentId) => handleEditComment(commentId, comments, dispatch);
  const onDelete = (commentId) => handleDeleteComment(commentId, comments, dispatch, navigate);
  const onLike = (commentId) => toggleCommentReaction(commentId, comments, commentlikedUser, dispatch, navigate);
  const onCancelEdit = () => {
    dispatch(setSubmitType({type: 'send', commentId: null}));
    dispatch(setNewComment(''));
  };

  return (
    <div className="space-y-6 ">
      {Array.isArray(comments) && comments.map((comment) => (
        <CommentItem
          key={comment._id}
          commentId={comment._id}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
          onCancelEdit={onCancelEdit}
          formatDate={formatDate}
        />
      ))}
      {comments.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default CommentList; 