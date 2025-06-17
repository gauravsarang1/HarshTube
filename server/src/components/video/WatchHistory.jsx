import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Loader2, Trash2 } from 'lucide-react';

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const fetchWatchHistory = useCallback(async (page) => {
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

      const response = await axios.get(`http://localhost:5050/api/v1/watch-history/get/?page=${page}`, {
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
        setError('Failed to fetch watch history. Please try again later.');
        console.error('Error fetching watch history:', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchWatchHistory(1);
  }, [fetchWatchHistory]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000;

      if (scrollPosition >= threshold) {
        if (!loadingMore && hasMore) {
          fetchWatchHistory(currentPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, fetchWatchHistory]);

  // Helper functions for formatting
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  const handleClearWatchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
    } catch (error) {
      
    }
  }
  return (
    <div className='min-h-screen pt-10 px-4 sm:px-6 lg:px-8'>
      <div className='flex items-center justify-between gap-2 md:gap-4 mb-10'>
        <div className='flex items-center gap-2'>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watch History</h1>
            <span className="text-md text-white bg-blue-500 px-2 py-1 rounded-lg">
            {Array.isArray(videos) ? videos.length : 0} videos
            </span>
        </div>
        <button
            onClick={() => handleClearWatchHistory()}
            className="px-4 flex items-center gap-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
            <Trash2 size={20} />
            Clear All
        </button>
      </div>
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center min-h-[40vh]">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={() => fetchWatchHistory(1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : Array.isArray(videos) && videos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No watch history yet. Start watching some videos!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/watch/${video.videoId}`}
              className="group bg-white flex flex-row dark:bg-gray-900 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-800"
            >
              {/* Thumbnail */}
              <div className="relative min-w-[180px] max-w-[240px] w-2/5 aspect-video overflow-hidden flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs">
                  {formatDuration(video.duration)}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
              {/* Details */}
              <div className="flex flex-col justify-center p-4 w-full">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 text-lg">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {video.owner?.avatar && (
                    <img
                      src={video.owner.avatar}
                      alt={video.owner.fullName}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span>{video.owner?.fullName || 'Unknown User'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <span>{video.views} {video.views === 1 ? 'view' : 'views'}</span>
                  <span>•</span>
                  <span>{formatDate(video.createdAt)}</span>
                </div>
                <div className="text-xs text-gray-400">Duration: {formatDuration(video.duration)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}
      {/* No More Videos Message */}
      {!hasMore && Array.isArray(videos) && videos.length > 0 && !loading && (
        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
          No more videos to load
        </div>
      )}
    </div>
  );
};

export default WatchHistory; 