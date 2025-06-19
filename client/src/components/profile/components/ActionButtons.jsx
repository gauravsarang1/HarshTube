import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, UserPlus, Bell, Share2 } from 'lucide-react';

const ActionButtons = ({ isOwnProfile, handleLogout }) => (
  <div className="mt-6 flex gap-3 flex-wrap justify-center md:justify-start">
    {isOwnProfile ? (
      <>
        {/*
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-300 border-2 border-white dark:border-gray-800"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Logout
        </motion.button>
        */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-gray-800 dark:text-gray-100 px-6 py-2 rounded-full shadow-md border border-blue-200 dark:border-blue-800 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
        >
          <Settings size={20} />
          Settings
        </motion.button>
      </>
    ) : (
      <>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg border-2 border-white dark:border-gray-800 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-pink-700"
        >
          <UserPlus size={20} />
          Subscribe
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-gray-800 dark:text-gray-100 px-6 py-2 rounded-full shadow-md border border-blue-200 dark:border-blue-800 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
        >
          <Bell size={20} />
          Notifications
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-gray-800 dark:text-gray-100 px-6 py-2 rounded-full shadow-md border border-blue-200 dark:border-blue-800 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
        >
          <Share2 size={20} />
          Share
        </motion.button>
      </>
    )}
  </div>
);

export default ActionButtons; 