import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Video } from 'lucide-react';

const ProfileStats = ({ user }) => (
  <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
    <motion.div 
      whileHover={{ scale: 1.08 }}
      className="flex items-center gap-2 text-gray-800 dark:text-gray-100 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 px-5 py-2 rounded-full shadow-md border border-blue-300 dark:border-blue-800 transition-all duration-300"
    >
      <Users size={20} />
      <span className="font-semibold">{user.subscribersCount} <span className="font-normal">subscribers</span></span>
    </motion.div>
    <motion.div 
      whileHover={{ scale: 1.08 }}
      className="flex items-center gap-2 text-gray-800 dark:text-gray-100 bg-gradient-to-r from-green-200 via-emerald-200 to-blue-200 dark:from-green-900 dark:via-emerald-900 dark:to-blue-900 px-5 py-2 rounded-full shadow-md border border-green-300 dark:border-green-800 transition-all duration-300"
    >
      <UserPlus size={20} />
      <span className="font-semibold">{user.channelSubscribedToCount} <span className="font-normal">subscribed</span></span>
    </motion.div>
    <motion.div 
      whileHover={{ scale: 1.08 }}
      className="flex hidden md:flex items-center gap-2 text-gray-800 dark:text-gray-100 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900 px-5 py-2 rounded-full shadow-md border border-pink-300 dark:border-pink-800 transition-all duration-300"
    >
      <Video size={20} />
      <span className="font-semibold">{user.totalVideos} <span className="font-normal">videos</span></span>
    </motion.div>
  </div>
);

export default ProfileStats; 