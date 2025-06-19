import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadedVideos from '../../video/UploadedVideos';
import UserPlaylists from '../../playlist/UserPlaylists';
import LikedVideos from '../../video/LikedVideos';
import WatchHistory from '../../video/WatchHistory';

const TabContent = ({ activeTab }) => (
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
      {activeTab === 'liked videos' && <LikedVideos />}
      {activeTab === 'watch history' && <WatchHistory />}
    </motion.div>
  </AnimatePresence>
);

export default TabContent; 