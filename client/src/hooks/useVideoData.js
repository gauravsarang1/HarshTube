import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useVideoData = (videoId) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [totalSubscribersCount, setTotalSubscribersCount] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;
      try {
        setLoading(true);
        const response = await api.get(`/videos/${videoId}`);
        const videoData = response.data.data;
        setVideo(videoData);

        if (videoData?.owner?._id) {
          const subscribersResponse = await api.get(`/subscription/get/user/subscribers/${videoData.owner._id}`);
          const data = subscribersResponse?.data?.data;
          setTotalSubscribersCount(data?.totalSubscribers || 0);
          setIsSubscribed(data?.isSubscribed || false);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch video data');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  return { video, loading, error, isSubscribed, totalSubscribersCount, setIsSubscribed, setTotalSubscribersCount };
}; 