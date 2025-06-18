import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Video } from 'lucide-react';

const ProfileStats = ({ user }) => (
  <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
    >
      <Users size={20} />
      <span>{user.subscribersCount} subscribers</span>
    </motion.div>
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
    >
      <UserPlus size={20} />
      <span>{user.channelSubscribedToCount} subscribed</span>
    </motion.div>
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
    >
      <Video size={20} />
      <span>{user.totalVideos} videos</span>
    </motion.div>
  </div>
);

export default ProfileStats; 