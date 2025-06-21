import { Upload, Sun, Moon, Bell, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DropDown from '../DropDown';

const AuthenticatedActions = ({ 
  darkMode, 
  toggleThemeMode, 
  userData, 
  handleLogout, 
  navigate 
}) => {
  return (
    <div className="flex items-center gap-3">
      {/* Upload Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/upload" 
          className="relative hidden md:flex items-center justify-center p-3 px-4 text-white rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Upload size={20} className="relative z-10" />
        </Link>
      </motion.div>

      {/* Notifications Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button className="relative hidden md:flex p-3 text-gray-700 dark:text-gray-300 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <Bell size={20} className="group-hover:scale-110 transition-transform duration-200" />
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </button>
      </motion.div>

      {/* Theme Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          onClick={toggleThemeMode}
          className="p-3 text-yellow-600 dark:text-yellow-400 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 hover:from-yellow-200 hover:to-orange-200 dark:hover:from-yellow-800/50 dark:hover:to-orange-800/50 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          {darkMode ? (
            <Sun size={20} className="group-hover:rotate-180 transition-transform duration-500" />
          ) : (
            <Moon size={20} className="group-hover:rotate-180 transition-transform duration-500" />
          )}
        </button>
      </motion.div>

      {/* User Dropdown */}
      <DropDown 
        userData={userData}
        handleTheme={toggleThemeMode}
        handleLogout={handleLogout}
        handleSettings={() => navigate('/settings')}
        handleProfile={() => navigate(`/profile/${userData?.username}`)}
        handleLikedVideos={() => navigate('/liked-videos')}
        handleWatchHistory={() => navigate('/watch-history')}
      />
    </div>
  );
};

export default AuthenticatedActions; 