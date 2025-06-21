import React from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Eye, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultUsers = ({ users = [] }) => {
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

  if (!users.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center min-h-[40vh]"
      >
        <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-xl px-8 py-12 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm text-center max-w-md w-full">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
            <User size={24} className="md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
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
          <Users size={20} className="md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
            Users
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
            {users.length} {users.length === 1 ? 'user' : 'users'} found
          </p>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <Link
              to={`/profile/${user.username}`}
              className="group block bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-4 md:p-6 overflow-hidden"
            >
              {/* User Avatar and Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.fullName || user.username}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-lg border-2 border-gray-200 dark:border-gray-700 group-hover:border-purple-300 dark:group-hover:border-purple-600 transition-colors duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg md:text-xl line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    {user.fullName || user.username}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium">
                    @{user.username}
                  </p>
                  {user.createdAt && (
                    <p className="text-gray-400 dark:text-gray-500 text-xs md:text-sm mt-1 flex items-center gap-1">
                      <Calendar size={12} className="md:w-3 md:h-3" />
                      Joined {formatDate(user.createdAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 rounded-xl border border-blue-200/50 dark:border-blue-700/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Users size={12} className="md:w-4 md:h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Subscribers</p>
                      <p className="text-sm md:text-base font-bold text-blue-700 dark:text-blue-300">
                        {formatNumber(user.subscribersCount || 0)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Eye size={12} className="md:w-4 md:h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Views</p>
                      <p className="text-sm md:text-base font-bold text-purple-700 dark:text-purple-300">
                        {formatNumber(user.totalViews || 0)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Additional Info */}
              {user.bio && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    View Profile
                  </span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp size={12} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* No More Results */}
      {users.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8 text-sm text-gray-500 dark:text-gray-400"
        >
          Showing {users.length} {users.length === 1 ? 'user' : 'users'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResultUsers; 