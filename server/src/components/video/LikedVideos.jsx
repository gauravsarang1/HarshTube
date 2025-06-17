import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VideoGrid from './VideoGrid';

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const fetchLikedVideos = useCallback(async (page) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5050/api/v1/likes/get/user/liked-videos?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log(response.data.data);
      
      const { videos: videoList, hasMore: more } = response.data.data;
      
      if (page === 1) {
        setVideos(videoList);
      } else {
        // Ensure no duplicate videos are added
        setVideos(prev => {
          const existingIds = new Set(prev.map(v => v._id));
          const newVideos = videoList.filter(v => !existingIds.has(v._id));
          return [...prev, ...newVideos];
        });
      }
      
      setHasMore(more);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch liked videos. Please try again later.');
        console.error('Error fetching liked videos:', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchLikedVideos(1);
  }, [fetchLikedVideos]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000;

      if (scrollPosition >= threshold) {
        if (!loadingMore && hasMore) {
          fetchLikedVideos(currentPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, fetchLikedVideos]);

  return (
    <div className='min-h-screen pt-10 px-4 sm:px-6 lg:px-8'>
      <div className='flex items-center gap-2 md:gap-4'>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Liked Videos</h1>
          <span className="text-md text-white bg-blue-500 px-2 py-1 rounded-lg">
            {Array.isArray(videos) ? videos.length : 0} videos
          </span>
        </div>
      <VideoGrid
        videos={videos}
        loading={loading}
        error={error}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onClick={() => fetchLikedVideos(1)}
        emptyMessage="No liked videos yet. Like some videos to see them here!"
      />
    </div>
  );
};

export default LikedVideos; 