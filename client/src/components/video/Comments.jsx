import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageCircle, Loader2, Trash2, Heart, Pencil, X } from 'lucide-react';

const Comments = ({ videoId }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [ submitType, setSubmitType] = useState({type: 'send', commentId: null});
  const [commentReaction, setCommentReaction] = useState(null);
  const [commentlikedUser, setCommentlikedUser] = useState([]);

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchComments();
  }, [videoId, comments.length]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5050/api/v1/comments/all/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setComments(response.data.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch comments. Please try again later.');
        console.error('Error fetching comments:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
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
        setSubmitType({type: 'send', commentId: null});
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

      setComments(prev => [response.data.data, ...prev]);
      setNewComment('');
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to post comment. Please try again later.');
        console.error('Error posting comment:', err);
        setSubmitType({type: 'send'});
      }
    } finally {
      setSubmitting(false);
      setSubmitType({type: 'send'});
    }
  };

  const handleReaction = async (commentId, reactionType) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:5050/api/v1/comments/${commentId}/reaction`,
        { reactionType },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the comment's reactions in the state
      setComments(prev => prev.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            likes: response.data.data.likes,
            dislikes: response.data.data.dislikes
          };
        }
        return comment;
      }));

      // Update user's reaction state
      setUserReactions(prev => ({
        ...prev,
        [commentId]: reactionType
      }));
    } catch (err) {
      console.error('Error reacting to comment:', err);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      setEditingComment(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.patch(
        `http://localhost:5050/api/v1/comments/edit/${commentId}`,
        {
          content: newComment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEditingComment(false);
    } catch (err) {
      console.error('Error editing comment:', err);
      setEditingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
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

      // Remove the deleted comment from the state
      setComments(prev => prev.filter(comment => comment._id !== commentId));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to delete comment. Please try again later.');
        console.error('Error deleting comment:', err);
      }
    }
  };

  const toggleCommentReaction = async (commentId) => {
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
      if(response.data.data.comment) {
        setCommentlikedUser(prev => [...prev, response.data.data]);
      } 
    }
      catch (err) {
      console.error('Error reacting to comment:', err);
      setCommentlikedUser(null);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            rows="2"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              submitType.type === 'edit' ? 'Update' : 'Comment'
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 dark:text-red-400 mb-4">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
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
                        onClick={(e) => setSubmitType({type: 'edit', commentId: comment._id})}
                        className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                        title="Edit comment"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={() => setSubmitType({type: 'send', commentId: comment._id})}
                        className={`${submitType.type !== 'send'? '' : 'hidden'} p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors`}
                        title="cancel Edit"
                    >
                        <X size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteComment(comment._id)}
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
                    onClick={() => toggleCommentReaction(comment._id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full ${commentlikedUser?.some(liked => liked.comment === comment._id) ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <Heart size={16} />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <MessageCircle size={16} />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments; 