import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Play, Loader2, Trash2, Clock, Eye, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const navigate = useNavigate();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { username } = useParams();
  const [stats, setStats] = useState({
    totalViews: 0,
    totalDuration: 0,
    averageViews: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsOwnProfile(user?.username === username);
  }, [username]);

  const fetchWatchHistory = useCallback(async (page) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/watch-history/get/?page=${page}`, {
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
          const existingIds = new Set(prev.map(v => v.videoId || v._id));
          const newVideos = videoList.filter(v => !existingIds.has(v.videoId || v._id));
          return [...prev, ...newVideos];
        });
      }
      
      setHasMore(more);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
    if (videos.length > 0) {
      const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
      const totalDuration = videos.reduce((sum, video) => sum + (video.duration || 0), 0);
      const averageViews = Math.round(totalViews / videos.length);
      
      setStats({
        totalViews,
        totalDuration,
        averageViews
      });
    }
  }, [videos]);

  const clearAllWatchHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all watch history? This action cannot be undone.')) {
      return;
    }

    try {
      setIsClearing(true);
      const token = localStorage.getItem('token');
      if(!token) {
        navigate('/login');
        return;
      }
      const response = await axios.delete(`${API_BASE_URL}/watch-history/delete/all/watch-history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 200) {
        setVideos([]);
        setCurrentPage(1);
        setHasMore(true);
        setStats({ totalViews: 0, totalDuration: 0, averageViews: 0 });
      }
    } catch (error) {
      console.error('Error clearing all watch history:', error);
    } finally {
      setIsClearing(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000;

      if (scrollPosition >= threshold) {
        if (!loadingMore && hasMore && !loading) {
          fetchWatchHistory(currentPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, loading, fetchWatchHistory]);

  // Helper functions for formatting
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
            {/* Title and Stats */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                    <Clock size={18} className="md:w-5 md:h-5 text-white" />
                  </div>
                  <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-amber-800 dark:from-white dark:via-orange-200 dark:to-amber-200 bg-clip-text text-transparent">
                    My Watch History
                  </h1>
                </div>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm md:text-base font-semibold shadow-sm border border-orange-200/50 dark:border-orange-700/50"
                >
                  {Array.isArray(videos) ? videos.length : 0} videos
                </motion.span>
              </div>
              
              {/* Stats Cards */}
              {videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 md:p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50 shadow-sm"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Eye size={16} className="md:w-5 md:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Total Views</p>
                        <p className="text-lg md:text-xl font-bold text-blue-700 dark:text-blue-300">{formatNumber(stats.totalViews)}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-3 md:p-4 rounded-xl border border-orange-200/50 dark:border-orange-700/50 shadow-sm"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                        <Clock size={16} className="md:w-5 md:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Total Duration</p>
                        <p className="text-lg md:text-xl font-bold text-orange-700 dark:text-orange-300">{formatTotalDuration(stats.totalDuration)}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 md:p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <TrendingUp size={16} className="md:w-5 md:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Avg. Views</p>
                        <p className="text-lg md:text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatNumber(stats.averageViews)}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
            
            {/* Clear All Button */}
            {isOwnProfile && videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={clearAllWatchHistory}
                  disabled={isClearing}
                  className="group relative overflow-hidden flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-red-400/50 dark:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon */}
                  {isClearing ? (
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                  ) : (
                    <Trash2 size={18} className="md:w-5 md:h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  )}
                  
                  {/* Text */}
                  <span className="text-sm md:text-base font-medium relative z-10">
                    {isClearing ? 'Clearing...' : 'Clear History'}
                  </span>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Content Section */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center min-h-[40vh]"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your watch history...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center min-h-[40vh]"
          >
            <div className="text-red-500 mb-4 text-center">
              <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
              <p className="text-lg font-semibold">{error}</p>
            </div>
            <button
              onClick={() => fetchWatchHistory(1)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </motion.div>
        ) : Array.isArray(videos) && videos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 md:py-16"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
              <Clock size={24} className="md:w-8 md:h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">No watch history yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6">Start watching videos to build your history!</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <AlertTriangle size={16} />
              <span>Your watch history will appear here as you browse videos</span>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video._id || video.videoId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Link
                  to={`/watch/${video.videoId}`}
                  className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 flex flex-row rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative min-w-[180px] max-w-[240px] w-2/5 aspect-video overflow-hidden flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      {formatDuration(video.duration)}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  {/* Details */}
                  <div className="flex flex-col justify-center p-4 w-full">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
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
                      <span>{formatNumber(video.views)} {video.views === 1 ? 'view' : 'views'}</span>
                      <span>•</span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                    <div className="text-xs text-gray-400">Duration: {formatDuration(video.duration)}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Loading More Indicator */}
        {loadingMore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </motion.div>
        )}
        
        {/* No More Videos Message */}
        {!hasMore && Array.isArray(videos) && videos.length > 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
          >
            No more videos to load
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WatchHistory; 