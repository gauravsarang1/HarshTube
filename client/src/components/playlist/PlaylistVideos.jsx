import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Loader2, Plus, Music, Eye, Calendar, User, AlertTriangle, ArrowLeft } from 'lucide-react';
import AddToPlaylist from './AddToPlaylist';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '../../utils/toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const PlaylistVideos = () => {
  const { playlistId } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [playlist, setPlaylist] = useState({
    name: '',
    description: '',
    totalVideos: 0,
    owner: {}
  });
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const navigate = useNavigate();
  const [ownProfile, setOwnProfile] = useState(false);
  const [stats, setStats] = useState({
    totalDuration: 0,
    totalViews: 0,
    averageViews: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user?.username === playlist.owner?.username) {
      setOwnProfile(true);
    }
  }, [playlist]);

  // Calculate stats
  useEffect(() => {
    if (videos.length > 0) {
      const totalDuration = videos.reduce((sum, video) => sum + (video.duration || 0), 0);
      const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
      const averageViews = Math.round(totalViews / videos.length);
      
      setStats({
        totalDuration,
        totalViews,
        averageViews
      });
    }
  }, [videos]);

  const fetchPlaylistVideos = useCallback(async (page) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        showError('Please login to view this playlist');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/playlist/user/${playlistId}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.data.statusCode === 200) {
        showSuccess('Playlist videos fetched successfully');
      } else {
        showError(response.data.message);
      }
      
      const { playlist, hasMore: more, totalVideos } = response.data.data;
      const {name, description, videos: videoList, owner } = playlist;

      setPlaylist({
        name,
        description,
        totalVideos,
        owner
      });

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
        setError('Failed to fetch playlist videos. Please try again later.');
        console.error('Error fetching playlist videos:', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [playlistId, navigate]);

  useEffect(() => {
    fetchPlaylistVideos(1);
  }, [fetchPlaylistVideos]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000;

      if (scrollPosition >= threshold && !loadingMore && hasMore && !loading) {
        fetchPlaylistVideos(currentPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, loading, fetchPlaylistVideos]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
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
      return date.toLocaleDateString();
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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }, (_, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="animate-pulse bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
        >
          <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-xl"></div>
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm text-center"
        >
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-500 dark:text-red-400 font-semibold text-lg mb-6">{error}</p>
          <button
            onClick={() => fetchPlaylistVideos(1)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 mb-6 transition-all duration-300"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Playlists</span>
        </motion.button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
        >
          {/* Playlist Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Music size={20} className="md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                      {playlist?.name || 'Playlist'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                      {playlist?.description || 'No description available'}
                    </p>
                  </div>
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
                          <Clock size={16} className="md:w-5 md:h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Total Duration</p>
                          <p className="text-lg md:text-xl font-bold text-purple-700 dark:text-purple-300">{formatTotalDuration(stats.totalDuration)}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 md:p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                          <User size={16} className="md:w-5 md:h-5 text-white" />
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
              
              {/* Add Videos Button */}
              {ownProfile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => setShowAddToPlaylist(true)}
                    className="group relative overflow-hidden flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-400/50 dark:border-purple-500/50"
                  >
                    {/* Button background animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Icon */}
                    <Plus size={18} className="md:w-5 md:h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                    
                    {/* Text */}
                    <span className="text-sm md:text-base font-medium relative z-10">Add Videos</span>
                    
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Videos Grid */}
          {!loading && (!Array.isArray(videos) || videos.length === 0) ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 md:py-16"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                <Music size={24} className="md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">This playlist is empty</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6">Start adding videos to create an amazing playlist!</p>
              {ownProfile && (
                <button
                  onClick={() => setShowAddToPlaylist(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus size={16} />
                  Add Your First Video
                </button>
              )}
            </motion.div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 ${showAddToPlaylist?'lg:grid-cols-3 md:grid-cols-2':'lg:grid-cols-4 md:grid-cols-3'}`}>
              {Array.isArray(videos) && videos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Link
                    to={`/watch/${video._id}`}
                    className="group block max-w-[400px] mx-auto w-full"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg text-sm font-medium">
                        {formatDuration(video.duration)}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          {playlist.owner?.avatar && (
                            <img
                              src={playlist.owner.avatar}
                              alt={playlist.owner.fullName}
                              className="w-6 h-6 rounded-full shadow"
                            />
                          )}
                          <span>{playlist.owner?.fullName || 'Unknown User'}</span>
                        </div>
                        <span>•</span>
                        <span>{formatNumber(video.views)} {video.views === 1 ? 'view' : 'views'}</span>
                        <span>•</span>
                        <span>{formatDate(video.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {loadingMore && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center py-8"
            >
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </motion.div>
          )}

          {/* No More Videos Message */}
          {!hasMore && Array.isArray(videos) && videos.length > 0 && (
            <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
              No more videos to load
            </div>
          )}
        </motion.div>
        
        {/* Add To Playlist Modal */}
        <AnimatePresence>
          {showAddToPlaylist && (
            <AddToPlaylist
              onclick={() => setShowAddToPlaylist(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlaylistVideos; 