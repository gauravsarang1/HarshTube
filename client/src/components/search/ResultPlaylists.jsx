import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Music, Eye, Clock, Calendar, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultPlaylists = ({ playlists = [] }) => {
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

  if (!playlists.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center min-h-[40vh]"
      >
        <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-xl px-8 py-12 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm text-center max-w-md w-full">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
            <Music size={24} className="md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">No playlists found</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Try adjusting your search terms or browse other categories
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 mt-6 md:mt-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
          <Music size={20} className="md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
            Playlists
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
            {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'} found
          </p>
        </div>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {playlists.map((playlist, index) => (
          <motion.div
            key={playlist._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <Link
              to={`/playlist/${playlist._id}`}
              className="group block bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden"
            >
              {/* Playlist Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={playlist.PlaylistThumbnail || '/default-playlist.png'}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Video Count Badge */}
                <div className="absolute top-3 right-3 backdrop-blur-md bg-black/60 text-white px-2 py-1 rounded-lg text-sm font-medium">
                  {playlist.videosCount || (playlist.videos ? playlist.videos.length : 0)} videos
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/90 dark:bg-black/80 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Play size={20} className="md:w-7 md:h-7 text-purple-600 dark:text-purple-400 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Playlist Info */}
              <div className="p-4 md:p-5">
                {/* Title */}
                <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg line-clamp-2 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {playlist.name}
                </h3>

                {/* Owner Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={playlist.owner?.avatar || '/default-avatar.png'}
                      alt={playlist.owner?.fullName || playlist.owner?.username || 'User'}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm border-2 border-gray-200 dark:border-gray-700"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base line-clamp-1">
                      {playlist.owner?.fullName || playlist.owner?.username || 'Unknown User'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                      @{playlist.owner?.username || 'unknown'}
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
                          {formatNumber(playlist.totalViews || 0)}
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
                        <Users size={10} className="md:w-3 md:h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Videos</p>
                        <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                          {playlist.videosCount || (playlist.videos ? playlist.videos.length : 0)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="md:w-3 md:h-3" />
                    <span>{formatDate(playlist.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="md:w-3 md:h-3" />
                    <span>View</span>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* No More Results */}
      {playlists.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
        >
          Showing {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResultPlaylists; 