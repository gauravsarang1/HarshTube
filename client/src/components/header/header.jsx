import React, { useState, createContext, useContext, useEffect, use } from 'react';
import { setSearchTerm } from '../../features/header/searchBarSlice';
import { toggleTheme } from '../../features/header/themeSlice';
import { toggleSideBar, closeSideBar } from '../../features/header/sideBarSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Upload , Search, Mic, Plus, Bell, User, Home, Scissors, Play, Clock, List, PlaySquare, GraduationCap, ThumbsUp, ChevronRight, ChevronDown, TrendingUp, Sun, Moon, X, LogOut, Heart, History, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import DropDown from './DropDown';
import ThemeButton from './components/ThemeButton';

// Components
import SearchOverlay from './components/SearchOverlay';
import DesktopSearch from './components/DesktopSearch';
import MobileSearchButton from './components/MobileSearchButton';
import AuthenticatedActions from './components/AuthenticatedActions';

// Utils
import { fetchUserData, logoutUser } from './utils/api';

// Header Component
const Header = () => {
  const darkMode = useSelector((state) => state.themes.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      loadUserData(token);
    }
  }, []);

  const loadUserData = async (token) => {
    try {
      const data = await fetchUserData(token);
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await logoutUser(token);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserData(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleThemeMode = () => {
    dispatch(toggleTheme());
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-950/95 shadow-2xl z-40 border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-3 h-8 bg-gradient-to-b from-blue-500 via-purple-600 to-pink-600 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent tracking-tight">
                    Harsh
                  </span>
                  <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                    Tube
                  </span>
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 animate-pulse" />
                </div>
              </Link>
            </motion.div>

            {/* Desktop Search */}
            <DesktopSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />

            {/* Mobile Search Button */}
            <MobileSearchButton onClick={() => setIsSearchOpen(true)} />

            {/* Authenticated Actions */}
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AuthenticatedActions 
                  darkMode={darkMode}
                  toggleThemeMode={toggleThemeMode}
                  userData={userData}
                  handleLogout={handleLogout}
                  navigate={navigate}
                />
              </motion.div>
            )}

            {/* Unauthenticated Actions */}
            {!isAuthenticated && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <ThemeButton darkMode={darkMode} toggleThemeMode={toggleThemeMode} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/login" 
                    className="px-6 py-2.5 text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
                  >
                    <User size={18} />
                    Login
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;