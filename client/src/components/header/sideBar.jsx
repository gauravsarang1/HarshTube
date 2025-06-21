import React, { useState, createContext, useContext, useEffect } from 'react';
import { Menu, Search, Mic, Plus, Bell, User, Home, Scissors, Play, Clock, List, PlaySquare, GraduationCap, ThumbsUp, ChevronRight, ChevronDown, TrendingUp, Sun, Moon, Sparkles, Video, Heart, History, Settings, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Sidebar Component
const Sidebar = ({ sidebarOpen, showMoreSubs, setShowMoreSubs }) => {
  const darkMode = useSelector((state) => state.themes.darkMode);

  const subscriptions = [
    { name: "Army Study IN", avatar: "🔺", online: true, category: "Education" },
    { name: "Chai aur Code", avatar: "👨‍💻", online: true, category: "Programming" },
    { name: "Harkirat Singh", avatar: "👨", online: true, category: "Tech" },
    { name: "Rishabh Bidhuri", avatar: "👨‍🦱", online: true, category: "Entertainment" },
    { name: "CarryMinati", avatar: "👱", online: true, category: "Gaming" },
    { name: "Simplify with Ankit", avatar: "👨‍🏫", online: true, category: "Education" },
    { name: "Naresh i Technologies", avatar: "👨‍💼", online: true, category: "Technology" },
  ];

  const menuItems = [
    { icon: Home, label: "Home", path: "/", active: true, gradient: "from-blue-500 to-cyan-500" },
    { icon: Scissors, label: "Shorts", path: "/shorts", gradient: "from-purple-500 to-pink-500" },
    { icon: Play, label: "Subscriptions", path: "/subscriptions", gradient: "from-green-500 to-emerald-500", badge: true },
  ];

  const userItems = [
    { icon: Clock, label: "History", path: "/watch-history", gradient: "from-orange-500 to-red-500" },
    { icon: List, label: "Playlists", path: "/playlists", gradient: "from-purple-500 to-indigo-500" },
    { icon: PlaySquare, label: "Your videos", path: "/uploaded-videos", gradient: "from-blue-500 to-purple-500" },
    { icon: GraduationCap, label: "Your courses", path: "/courses", gradient: "from-green-500 to-teal-500" },
    { icon: Heart, label: "Liked videos", path: "/liked-videos", gradient: "from-pink-500 to-rose-500" },
  ];

  const exploreItems = [
    { icon: TrendingUp, label: "Trending", path: "/trending", gradient: "from-yellow-500 to-orange-500" },
    { icon: Zap, label: "Popular", path: "/popular", gradient: "from-red-500 to-pink-500" },
  ];

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ 
        width: sidebarOpen ? '16rem' : '4rem',
        x: 0,
        opacity: 1
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-950/95 fixed h-full overflow-y-auto transition-all duration-300 z-30 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 shadow-2xl"
    >
      <div className="p-4">
        {/* Main Navigation */}
        <div className="mb-6 hidden md:block">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
            >
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg mb-2 group ${
                  item.active 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg` 
                    : 'hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.active 
                    ? 'bg-white/20' 
                    : `bg-gradient-to-br ${item.gradient} text-white`
                }`}>
                  <item.icon size={18} />
                </div>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    className="ml-3 flex-1 flex items-center justify-between"
                  >
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </motion.div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {sidebarOpen && (
          <>
            {/* You Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4 mb-6"
            >
              <div className="flex items-center p-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <span className="ml-3 text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  You
                </span>
                <ChevronRight size={16} className="ml-auto text-gray-500" />
              </div>
              
              {userItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                >
                  <Link
                    to={item.path}
                    className="flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg mb-2 group hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-900"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                      <item.icon size={18} className="text-white" />
                    </div>
                    <span className="ml-3 font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Subscriptions Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4 mb-6"
            >
              <h3 className="px-3 py-2 font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                Subscriptions
              </h3>
              {subscriptions.slice(0, showMoreSubs ? subscriptions.length : 5).map((sub, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg mb-2 group hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-900"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm text-white shadow-md">
                      {sub.avatar}
                    </div>
                    {sub.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      {sub.name}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {sub.category}
                    </p>
                  </div>
                </motion.div>
              ))}
              <motion.div 
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg group hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-900"
                onClick={() => setShowMoreSubs(!showMoreSubs)}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                  {showMoreSubs ? <ChevronDown size={18} className="text-white" /> : <ChevronRight size={18} className="text-white" />}
                </div>
                <span className="ml-3 font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  {showMoreSubs ? 'Show less' : 'Show more'}
                </span>
              </motion.div>
            </motion.div>

            {/* Explore Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4"
            >
              <h3 className="px-3 py-2 font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                Explore
              </h3>
              {exploreItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                >
                  <Link
                    to={item.path}
                    className="flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg mb-2 group hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-800 dark:hover:to-gray-900"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                      <item.icon size={18} className="text-white" />
                    </div>
                    <span className="ml-3 font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
