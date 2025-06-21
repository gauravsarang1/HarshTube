import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageCircle, Loader2, Trash2, Heart, Pencil, X } from 'lucide-react';
import { formatDate } from './utils/formatDate';
import { fetchComments } from './utils/fetchComments';
import { handleEditComment } from './utils/handleEditComment';
import { handleDeleteComment } from './utils/handleDeleteComment';
import { toggleCommentReaction } from './utils/toggleCommentReaction';
import { handleSubmitComment } from './utils/handleSubmitComment';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';
import { useSelector, useDispatch } from 'react-redux';
import { setComments, setLoading, setError, setSubmitType, setNewComment, setSubmitting, setCommentlikedUser, setCurrentUser, setVideoId } from '../../features/body/commentSlice';

const Comments = ({ videoId, loggedIn, currentUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { comments, loading, error, submitType, newComment, submitting, commentlikedUser } = useSelector(state => state.comment);
 

  useEffect(() => {
    dispatch(setVideoId(videoId));
    if (loggedIn && currentUser) {
      dispatch(setCurrentUser(currentUser));
    }
    fetchComments({ videoId, dispatch, navigate });
  }, [videoId, loggedIn, currentUser]);

  const handleToggleCommentReaction = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await toggleCommentReaction(commentId, comments, commentlikedUser, dispatch, navigate);

      const { type, owner } = response.data.data;

      // Update the comments state to reflect the new like status
      dispatch(setComments(prev => prev.map(comment => {
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

      // Update the liked comments state
      if (type === 'unLike') {
        dispatch(setCommentlikedUser(prev => prev.filter(liked => liked.comment?._id !== commentId)));
      } else {
        dispatch(setCommentlikedUser(prev => [...prev, response.data.data]));
      }
    } catch (err) {
      console.error('Error reacting to comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 py-8 border-2 border-blue-200 dark:border-blue-800 text-center animate-pulse">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <div className="text-lg font-semibold text-blue-500 dark:text-blue-400">Loading comments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {loggedIn ? (
        <CommentForm
          newComment={newComment}
          setNewComment={(val) => dispatch(setNewComment(val))}
          submitting={submitting}
          submitType={submitType}
          onSubmit={(e) => handleSubmitComment(e, newComment, submitType, videoId, dispatch, navigate)}
          onCancelEdit={() => {
            dispatch(setSubmitType({type: 'send', commentId: null}));
            dispatch(setNewComment(''));
          }}
        />
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg text-center text-white mb-4">
          <p>Please <a href="/login" className="text-blue-400 hover:underline">log in</a> to post a comment.</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow px-4 py-3 border border-red-200 dark:border-red-700 text-red-500 dark:text-red-400 mb-4 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Comments List */}
      <CommentList
        comments={comments}
        currentUser={currentUser}
        loggedIn={loggedIn}
        onEdit={(commentId) => handleEditComment(commentId, comments, dispatch)}
        onDelete={(commentId) => handleDeleteComment(commentId, comments, dispatch, navigate)}
        onLike={(commentId) => loggedIn ? handleToggleCommentReaction(commentId) : navigate('/login')}
        onCancelEdit={() => {
          dispatch(setSubmitType({type: 'send', commentId: null}));
          dispatch(setNewComment(''));
        }}
        submitType={submitType}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Comments;