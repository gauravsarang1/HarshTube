import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadedVideos from '../../video/UploadedVideos';
import UserPlaylists from '../../playlist/UserPlaylists';
import LikedVideos from '../../video/LikedVideos';
import WatchHistory from '../../video/WatchHistory';

const TabContent = ({ activeTab, isOwnProfile }) => {
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // For non-authenticated users, only show videos tab
  if (!isAuthenticated && activeTab !== 'videos' && activeTab !== 'playlists') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-blue-100 dark:border-blue-900 backdrop-blur-md p-4 md:p-8 text-center"
      >
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to view {activeTab}.
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-4 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-blue-100 dark:border-blue-900 backdrop-blur-md p-4 md:p-8"
      >
        {activeTab === 'videos' && <UploadedVideos />}
        {activeTab === 'playlists' && <UserPlaylists />}
        {activeTab === 'liked videos' && isAuthenticated && <LikedVideos />}
        {activeTab === 'watch history' && isAuthenticated && <WatchHistory />}
      </motion.div>
    </AnimatePresence>
  );
};

export default TabContent; 