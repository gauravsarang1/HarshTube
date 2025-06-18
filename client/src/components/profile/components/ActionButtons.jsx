import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, UserPlus, Bell, Share2 } from 'lucide-react';

const ActionButtons = ({ isOwnProfile, handleLogout }) => (
  <div className="mt-6 flex gap-3 flex-wrap justify-center md:justify-start">
    {isOwnProfile ? (
      <>
        {/*<motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors duration-300"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </motion.button>*/}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-full transition-colors duration-300"
        >
          <Settings size={20} />
          Settings
        </motion.button>
      </>
    ) : (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors duration-300"
        >
          <UserPlus size={20} />
          Subscribe
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-full transition-colors duration-300"
        >
          <Bell size={20} />
          Notifications
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-full transition-colors duration-300"
        >
          <Share2 size={20} />
          Share
        </motion.button>
      </>
    )}
  </div>
);

export default ActionButtons; 