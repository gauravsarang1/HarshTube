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

      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">HarshTube</span>
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