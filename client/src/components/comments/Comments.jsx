import React, { useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { formatDate } from './utils/formatDate';
import { fetchComments } from './utils/fetchComments';
import { handleEditComment } from './utils/handleEditComment';
import { handleDeleteComment } from './utils/handleDeleteComment';
import { handleSubmitComment } from './utils/handleSubmitComment';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../../context/SocketContext';
import { setSubmitType, setNewComment, setCurrentUser, setVideoId } from '../../features/body/commentSlice';

const Comments = ({ videoId, loggedIn, currentUser }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { comments, loading, error, submitType, newComment, submitting } = useSelector(state => state.comment);
  const socket = useSocket();
  // Initial fetch and user setup
  useEffect(() => {
    dispatch(setVideoId(videoId));
    if (loggedIn && currentUser) {
      dispatch(setCurrentUser(currentUser));
    }
    fetchComments({ videoId, dispatch, navigate });
  }, [videoId, loggedIn, currentUser, dispatch]);

  // Main socket listener for all comment-related updates
  useEffect(() => {
    if (!socket) return;

    const handleCommentUpdate = (data) => {
      // If the update is for the video we are currently watching, refetch the comments
      if (data.videoId === videoId) {
        console.log(`Comments updated for video ${videoId}, refetching...`);
        fetchComments({ videoId, dispatch, navigate });
      }
    };

    socket.on('comment-updated', handleCommentUpdate);

    // Cleanup the listener when the component unmounts or videoId changes
    return () => {
      socket.off('comment-updated', handleCommentUpdate);
    };
  }, [socket, videoId, dispatch, navigate]);


  // Handles the like button click
  const handleLikeClick = async (commentId) => {
    if (!loggedIn) {
        navigate('/login');
        return;
    }
    try {
      // Just send the request. The server will emit an event that triggers the refetch.
      await api.post(
        `/likes/toggle/c/${commentId}?reactionType=like`,
        { videoId }, // Pass videoId so the server knows which video's comments to update
      );
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
      // Optional: Add user-facing error message
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
        onLike={handleLikeClick}
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