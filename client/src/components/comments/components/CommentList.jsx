import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleEditComment } from '../utils/handleEditComment';
import { handleDeleteComment } from '../utils/handleDeleteComment';
import { toggleCommentReaction } from '../utils/toggleCommentReaction';
import { setSubmitType, setNewComment } from '../../../features/body/commentSlice';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import CommentItem from './CommentItem';

const CommentList = ({ comments, currentUser, loggedIn, onEdit, onDelete, onLike, onCancelEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 ">
      {Array.isArray(comments) && comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUser={currentUser}
          loggedIn={loggedIn}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
          onCancelEdit={onCancelEdit}
          formatDate={formatDate}
        />
      ))}
      {comments.length === 0 && (
        <div className="flex justify-center items-center min-h-[10vh]">
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 py-6 border-2 border-blue-200 dark:border-blue-800 text-center">
            <div className="text-base font-semibold text-gray-600 dark:text-gray-300">No comments yet. Be the first to comment!</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentList; 