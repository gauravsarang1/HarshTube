import React, { useState, createContext, useContext, useEffect, use } from 'react';
import { setSearchTerm } from '../../features/header/searchBarSlice';
import { toggleTheme } from '../../features/header/themeSlice';
import { toggleSideBar, closeSideBar } from '../../features/header/sideBarSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Upload , Search, Mic, Plus, Bell, User, Home, Scissors, Play, Clock, List, PlaySquare, GraduationCap, ThumbsUp, ChevronRight, ChevronDown, TrendingUp, Sun, Moon, X, LogOut, Heart, History } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropDown from './DropDown';

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

      <header className="fixed top-0 left-0 right-0 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80 shadow-xl z-40 border-b border-gray-200 dark:border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">HarshTube</span>
            </Link>

            <DesktopSearch 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />

            <MobileSearchButton onClick={() => setIsSearchOpen(true)} />

            {isAuthenticated && (
              <AuthenticatedActions 
                darkMode={darkMode}
                toggleThemeMode={toggleThemeMode}
                userData={userData}
                handleLogout={handleLogout}
                navigate={navigate}
              />
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;