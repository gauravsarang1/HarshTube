import React from 'react';
import { motion } from 'framer-motion';

const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile }) => (
  <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
    <nav className="flex space-x-8">
      {['videos', 'playlists'].map((tab) => (
        <motion.button
          key={tab}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab(tab)}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
            activeTab === tab
              ? 'border-red-500 text-red-600 dark:text-red-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </motion.button>
      ))}
      
      {isOwnProfile && ['liked videos', 'watch history'].map((tab) => (
        <motion.button
          key={tab}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab(tab)}
          className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
            activeTab === tab
              ? 'border-red-500 text-red-600 dark:text-red-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </motion.button>
      ))}
    </nav>
  </div>
);

export default ProfileTabs; 