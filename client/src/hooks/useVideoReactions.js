import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';

export const useVideoReactions = (videoId, loggedIn, currentUser) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [videoLikes, setVideoLikes] = useState([]);
  const [videoDislikes, setVideoDislikes] = useState([]);
  const socket = useSocket();

  const getAllReactions = useCallback(async () => {
    if (!loggedIn || !videoId) return;
    try {
      const [likesRes, dislikesRes] = await Promise.all([
        api.get(`/likes/get/video/likes/${videoId}`),
        api.get(`/likes/get/video/disLikes/${videoId}`)
      ]);
      
      const likes = likesRes.data?.data || [];
      const dislikes = dislikesRes.data?.data || [];
      
      setVideoLikes(likes);
      setVideoDislikes(dislikes);

      if (currentUser?.id) {
        setLiked(likes.some(reaction => reaction.likedById === currentUser.id));
        setDisliked(dislikes.some(reaction => reaction.dislikedById === currentUser.id));
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  }, [videoId, loggedIn, currentUser]);

  useEffect(() => {
    getAllReactions();
  }, [getAllReactions]);

  useEffect(() => {
    if (!socket || !videoId) return;

    const handleReactionUpdate = (data) => {
      if (data.videoId === videoId) {
        getAllReactions();
      }
    };

    socket.on('video-reaction-updated', handleReactionUpdate);
    return () => socket.off('video-reaction-updated', handleReactionUpdate);
  }, [socket, videoId, getAllReactions]);

  const toggleVideoReaction = async (reactionType) => {
    if (!loggedIn) return;
    try {
      await api.post(`/likes/toggle/v/${videoId}?reactionType=${reactionType}`);
    } catch (error) {
      console.error(`Error toggling ${reactionType}:`, error);
    }
  };

  return { liked, disliked, videoLikes, videoDislikes, toggleVideoReaction };
}; 