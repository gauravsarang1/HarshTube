import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Heart, MessageCircle, Pencil, Trash2, X } from 'lucide-react';
import fetchCommentLikes from '../utils/fetchCommentLikes';
import { useSocket } from '../../../context/SocketContext';
import { improveComment } from '../utils/commentImprover';

const CommentItem = ({ comment, currentUser, loggedIn, onEdit, onDelete, onLike, onCancelEdit, formatDate}) => {
  const { submitType} = useSelector(state => state.comment);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(comment.totalLikes || 0);
  const [improvedComment, setImprovedComment] = useState(comment.content);
  const socket = useSocket();

  

  const fetchLikes = async () => {
    try {
      const reactionData = await fetchCommentLikes({ commentId: comment._id });
      setTotalLikes(reactionData.totalLikes);
      setIsLiked(reactionData.isLiked);
     
    } catch (error) {
      console.error('Error fetching comment likes:', error);
    }
  };

  useEffect(() => {
    if (socket) {
      const handleReactionUpdate = (data) => {
        if (data.commentId === comment._id) {
          fetchLikes();
        }
      };

      socket.on('comment-reactions-updated', handleReactionUpdate);
      
      return () => {
        socket.off('comment-reactions-updated', handleReactionUpdate);
      };
    }
  }, [comment._id, socket, currentUser]);

  useEffect(() => {
    fetchLikes();
  }, [comment._id]);

  

  if (!comment) return null;

  return (
    <div className="flex gap-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow p-4 border border-blue-100 dark:border-blue-900 backdrop-blur-md transition-all duration-200">
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
          {loggedIn && currentUser && comment.owner?._id === currentUser.id && (
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
              className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 shadow-sm border focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 ${
                isLiked 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400 dark:border-blue-700' 
                  : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-blue-100 dark:border-blue-900'
              }`}
              disabled={!loggedIn}
          >
            <Heart size={16} />
            <span>Like {totalLikes > 0 ? `${totalLikes}` : ''}</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border border-blue-100 dark:border-blue-900 transition-all duration-200 shadow-sm">
            <MessageCircle size={16} />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem; 