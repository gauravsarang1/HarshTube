import React from 'react';
import { motion } from 'framer-motion';

const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile }) => {
  const allTabs = ['videos', 'playlists', ...(isOwnProfile ? ['liked videos', 'watch history'] : [])];
  return (
    <div className="mt-8 flex justify-center">
      <nav className="relative flex bg-gray-100 dark:bg-gray-800 rounded-full shadow-inner px-2 py-1 gap-1">
        {allTabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700
                ${isActive
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg z-10'
                  : 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}
              `}
              style={{ zIndex: isActive ? 2 : 1 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {isActive && (
                <motion.span
                  layoutId="profile-tab-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-20 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileTabs; 