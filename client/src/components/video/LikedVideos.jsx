import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import VideoGrid from './VideoGrid';
import { Trash2, Heart, TrendingUp, Eye, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const LikedVideos = () => {
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
    totalLikes: 0,
    averageViews: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsOwnProfile(user?.username === username);
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

      const response = await axios.get(`${API_BASE_URL}/likes/get/user/liked-videos?page=${page}`, {
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
    if (videos.length > 0) {
      const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
      const totalLikes = videos.reduce((sum, video) => sum + (video.likes || 0), 0);
      const averageViews = Math.round(totalViews / videos.length);
      
      setStats({
        totalViews,
        totalLikes,
        averageViews
      });
    }
  }, [videos]);

  const clearAllLikedVideos = async () => {
    if (!window.confirm('Are you sure you want to clear all liked videos? This action cannot be undone.')) {
      return;
    }

    try {
      setIsClearing(true);
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}/likes/delete/all/liked-videos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status === 200) {
        setVideos([]);
        setCurrentPage(1);
        setHasMore(true);
        setStats({ totalViews: 0, totalLikes: 0, averageViews: 0 });
      }
    } catch (err) {
      console.error('Error clearing all liked videos:', err);
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
          fetchLikedVideos(currentPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, loading, fetchLikedVideos]);

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
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Heart size={18} className="md:w-5 md:h-5 text-white" />
                  </div>
                  <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-pink-800 dark:from-white dark:via-red-200 dark:to-pink-200 bg-clip-text text-transparent">
                    My Liked Videos
                  </h1>
                </div>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-300 rounded-full text-sm md:text-base font-semibold shadow-sm border border-red-200/50 dark:border-red-700/50"
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
                    className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-3 md:p-4 rounded-xl border border-red-200/50 dark:border-red-700/50 shadow-sm"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                        <Heart size={16} className="md:w-5 md:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Total Likes</p>
                        <p className="text-lg md:text-xl font-bold text-red-700 dark:text-red-300">{formatNumber(stats.totalLikes)}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 md:p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Calendar size={16} className="md:w-5 md:h-5 text-white" />
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
                  onClick={clearAllLikedVideos}
                  disabled={isClearing}
                  className="group relative overflow-hidden flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-red-400/50 dark:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon */}
                  {isClearing ? (
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                  ) : (
                    <Trash2 size={18} className="md:w-5 md:h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  )}
                  
                  {/* Text */}
                  <span className="text-sm md:text-base font-medium relative z-10">
                    {isClearing ? 'Clearing...' : 'Clear All'}
                  </span>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-rose-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Video Grid */}
        <VideoGrid
          videos={videos}
          loading={loading}
          error={error}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onClick={() => fetchLikedVideos(1)}
          emptyMessage={
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 flex items-center justify-center">
                <Heart size={24} className="md:w-8 md:h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">No liked videos yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6">Start liking videos to see them here!</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <AlertTriangle size={16} />
                <span>Like videos while browsing to add them to this collection</span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default LikedVideos; 