import React from 'react';
import { motion } from 'framer-motion';
import { Video, List, Heart, Clock } from 'lucide-react';

const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile }) => {
  const allTabs = [
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'playlists', label: 'Playlists', icon: List },
    ...(isOwnProfile ? [
      { id: 'liked videos', label: 'Liked Videos', icon: Heart },
      { id: 'watch history', label: 'Watch History', icon: Clock }
    ] : [])
  ];

  return (
    <div className="mt-4 md:mt-6 flex justify-center">
      <nav className="relative flex bg-gradient-to-r from-slate-100 via-gray-100 to-slate-100 dark:from-slate-800 dark:via-gray-800 dark:to-slate-800 rounded-2xl shadow-lg px-1 md:px-2 py-1 gap-1 md:gap-2 overflow-x-auto max-w-full border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
        {allTabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative group flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 dark:focus:ring-blue-500/50 whitespace-nowrap overflow-hidden
                ${isActive
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-blue-500/25 z-10'
                  : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-white'}
              `}
              style={{ zIndex: isActive ? 2 : 1 }}
            >
              {/* Background glow for active tab */}
              {isActive && (
                <motion.div
                  layoutId="profile-tab-glow"
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-xl blur-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <div className={`relative z-10 transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`}>
                <IconComponent size={14} className="md:w-4 md:h-4" />
              </div>
              
              {/* Label */}
              <span className="relative z-10 font-medium">
                {tab.label}
              </span>
              
              {/* Active indicator line */}
              {isActive && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/80 to-white/40 rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Hover effect overlay */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'hidden' : 'block'}`} />
            </motion.button>
          );
        })}
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </nav>
    </div>
  );
};

export default ProfileTabs; 