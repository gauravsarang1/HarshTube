import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Upload, Video, TrendingUp, Eye, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoGrid from './VideoGrid';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const UploadedVideos = () => {
  const { username } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    averageViews: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsOwnProfile(user?.username === username);
  }, [username]);

  const fetchUploadedVideos = useCallback(async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/videos/all-uploaded-videos/${username}?page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const { videos: videoList, hasMore: more } = response.data.data;
      
      if (pageNum === 1) {
        // Reset videos for first page
        setVideos(videoList);
      } else {
        // Append videos for subsequent pages
        setVideos(prev => {
          const existingIds = new Set(prev.map(video => video._id));
          const newVideos = videoList.filter(video => !existingIds.has(video._id));
          return [...prev, ...newVideos];
        });
      }
      
      setHasMore(more);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch uploaded videos. Please try again later.');
        console.error('Error fetching uploaded videos:', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [username, navigate]);

  useEffect(() => {
    fetchUploadedVideos(1);
  }, [fetchUploadedVideos]);


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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000;

      if (scrollPosition >= threshold) {
        if (!loadingMore && hasMore && !loading) {
          fetchUploadedVideos(page + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, page, loading, fetchUploadedVideos]);

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
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Video size={18} className="md:w-5 md:h-5 text-white" />
                  </div>
                  <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    My Uploaded Videos
                  </h1>
                </div>
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm md:text-base font-semibold shadow-sm border border-blue-200/50 dark:border-blue-700/50"
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
                    className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 md:p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50 shadow-sm"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <TrendingUp size={16} className="md:w-5 md:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Total Likes</p>
                        <p className="text-lg md:text-xl font-bold text-purple-700 dark:text-purple-300">{formatNumber(stats.totalLikes)}</p>
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
            
            {/* Upload Button */}
            {isOwnProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/upload`}
                  className="group relative overflow-hidden flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/50 dark:border-blue-500/50"
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon */}
                  <Upload size={18} className="md:w-5 md:h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  
                  {/* Text */}
                  <span className="text-sm md:text-base font-medium relative z-10">Upload Video</span>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
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
          onClick={() => fetchUploadedVideos(1)}
          emptyMessage={
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <Video size={24} className="md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">No videos uploaded yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6">Start sharing your amazing content with the world!</p>
              {isOwnProfile && (
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  <Upload size={16} />
                  Upload Your First Video
                </Link>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default UploadedVideos; 