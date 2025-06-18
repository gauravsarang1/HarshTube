import React from 'react';
import { useSelector } from 'react-redux';
import { Heart, MessageCircle, Pencil, Trash2, X } from 'lucide-react';

const CommentItem = ({ commentId, onEdit, onDelete, onLike, onCancelEdit, formatDate }) => {
  const { comments, currentUser, submitType } = useSelector(state => state.comment);
  const comment = comments.find(c => c._id === commentId);
  if (!comment) return null;

  return (
    <div className="flex gap-4">
      {comment.owner?.avatar && (
        <img
          src={comment.owner.avatar}
          alt={comment.owner.fullName}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {comment.owner?.fullName || 'Unknown User'}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          {currentUser && comment.owner?._id === currentUser.id && (
            <div className="flex items-center gap-2">
              <button 
                  onClick={() => onEdit(comment._id)}
                  className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  title="Edit comment"
              >
                  <Pencil size={16} />
              </button>
              <button
                  onClick={onCancelEdit}
                  className={`${(submitType.commentId === comment._id) ? '' : 'hidden'} p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors`}
                  title="Cancel Edit"
              >
                  <X size={16} />
              </button>
              <button
                  onClick={() => onDelete(comment._id)}
                  className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  title="Delete comment"
              >
                  <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-gray-700 dark:text-gray-300">
          {comment.content}
        </p>
        <div className="mt-2 flex items-center gap-4">
          <button 
              onClick={() => onLike(comment._id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                comment.isLiked 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
          >
            <Heart size={16} />
            <span>Like {comment.totalLikes > 0 ? `${comment.totalLikes}` : ''}</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <MessageCircle size={16} />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem; 