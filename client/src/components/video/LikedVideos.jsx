import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import VideoGrid from './VideoGrid';
import { Trash2 } from 'lucide-react';

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { username } = useParams();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsOwnProfile(user.username === username);
  }, [username]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className='flex flex-wrap items-center gap-3 md:gap-5'>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            My Liked Videos
          </h1>
          <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
            {Array.isArray(videos) ? videos.length : 0} videos
          </span>
        </div>
        {isOwnProfile && (
          <button
          onClick={() => clearAllLikedVideos()}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Trash2 size={20} className="sm:size-5" />
          <span className="text-sm sm:text-base font-medium">Clear All</span>
        </button>
        )}
        
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