import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Loader2, Eye, Clock, Calendar, TrendingUp, Users, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoGrid = ({ 
  videos, 
  loading, 
  error, 
  loadingMore, 
  hasMore,
  onClick,
  emptyMessage = "No videos found."
}) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[60vh]"
      >
        <div className="text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading videos...</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Please wait while we fetch your content</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center min-h-[60vh]"
      >
        <div className="text-center max-w-md">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 md:w-10 md:h-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-6 md:py-8"
    >
      {Array.isArray(videos) && videos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center min-h-[40vh]"
        >
          <div className="text-center max-w-md">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-gray-600 dark:text-gray-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">No videos found</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{emptyMessage}</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {Array.isArray(videos) && videos.map((video, index) => {
            const isNew = (() => {
              if (!video.createdAt) return false;
              const created = new Date(video.createdAt).getTime();
              const now = Date.now();
              return (now - created) < 24 * 60 * 60 * 1000;
            })();
            return (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Link
                  to={`/watch/${video._id || video.videoId}`}
                  className="group block bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* New Badge */}
                    {isNew && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                      >
                        NEW
                      </motion.div>
                    )}
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-3 right-3 backdrop-blur-md bg-black/70 text-white px-2 py-1 rounded-lg text-sm font-medium">
                      {formatDuration(video.duration)}
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/90 dark:bg-black/80 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <Play size={20} className="md:w-7 md:h-7 text-purple-600 dark:text-purple-400 ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4 md:p-5">
                    {/* Title */}
                    <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {video.title}
                    </h3>

                    {/* Owner Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <img
                          src={video.owner?.avatar || '/default-avatar.png'}
                          alt={video.owner?.fullName || 'User'}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm border-2 border-gray-200 dark:border-gray-700"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base line-clamp-1">
                          {video.owner?.fullName || 'Unknown User'}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                          @{video.owner?.username || 'unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-2 md:p-3 rounded-xl border border-blue-200/50 dark:border-blue-700/50"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Eye size={10} className="md:w-3 md:h-3 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Views</p>
                            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                              {formatNumber(video.views || 0)}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-2 md:p-3 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Clock size={10} className="md:w-3 md:h-3 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Duration</p>
                            <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                              {formatDuration(video.duration)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="md:w-3 md:h-3" />
                        <span>{formatDate(video.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={12} className="md:w-3 md:h-3" />
                        <span>Watch</span>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-8"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Loading more videos...</p>
          </div>
        </motion.div>
      )}

      {/* No More Videos Message */}
      {!hasMore && Array.isArray(videos) && videos.length > 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            No more videos to load
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VideoGrid; 