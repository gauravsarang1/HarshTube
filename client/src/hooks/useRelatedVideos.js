import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useRelatedVideos = (videoId) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchRelatedVideos = useCallback(async (page) => {
    if (!videoId) return;
    try {
      setLoadingMore(true);
      const response = await api.get(`/videos/all-videos?page=${page}&limit=${10}`);
      const { videos: videoList, hasMore: more } = response.data.data;

      const filteredVideos = videoList.filter(v => v._id !== videoId);
      const randomVideos = filteredVideos.sort(() => Math.random() - 0.5);

      if (page === 1) {
        setRelatedVideos(randomVideos);
      } else {
        setRelatedVideos(prev => {
          const existingIds = new Set(prev.map(v => v._id));
          const newVideos = randomVideos.filter(v => !existingIds.has(v._id));
          return [...prev, ...newVideos];
        });
      }

      setHasMore(more);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching related videos:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchRelatedVideos(1);
  }, [fetchRelatedVideos]);

  return { relatedVideos, loadingMore, hasMore, fetchRelatedVideos, currentPage };
}; 