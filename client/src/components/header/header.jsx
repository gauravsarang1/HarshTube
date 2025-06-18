import React, { useState, createContext, useContext, useEffect, use } from 'react';
import { setSearchTerm } from '../../features/header/searchBarSlice';
import { toggleTheme } from '../../features/header/themeSlice';
import { toggleSideBar, closeSideBar } from '../../features/header/sideBarSlice';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Upload , Search, Mic, Plus, Bell, User, Home, Scissors, Play, Clock, List, PlaySquare, GraduationCap, ThumbsUp, ChevronRight, ChevronDown, TrendingUp, Sun, Moon, X, LogOut, Heart, History } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropDown from './DropDown';

// Header Component
const Header = () => {
  //const searchTerm = useSelector((state) => state.searchBar.searchTerm);
  //const sideBarOpen = useSelector((state) => state.sideBar.isSideBarOpen);
  const darkMode = useSelector((state) => state.themes.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    if (token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5050/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5050/api/v1/users/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-white dark:bg-gray-800 p-4">
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </form>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">HarshTube</span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Mobile Search Button */}
            <div
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center gap-1 px-2 py-1 w-30 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-700 lg:hidden cursor-pointer hover:shadow-sm"
            >
              
              <span className="text-md font-semibold">Search</span>
              <Search size={20} />
            </div>


            {isAuthenticated && (
                <div className=" flex items-center gap-2">
                  <Link to="/upload" className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Upload  size={24} />
                  </Link>
                  <button
                    onClick={toggleThemeMode}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                  </button>
                  <DropDown 
                      userData={userData}
                      handleTheme={() => toggleThemeMode()}
                      handleLogout={() => handleLogout()}
                      handleSettings={() => navigate(`/settings`)}
                      handleProfile={() => navigate(`/profile/${userData?.username}`)}
                  />
                  {/*<Link to={`/profile/${userData?.username}`} className="flex relative group items-center gap-2">
                    {userData?.avatar ? (
                      <img
                        src={userData.avatar}
                        alt={userData.fullName}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User size={20} className="text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    {/* User Menu Dropdown */}
                    
                    {/*<div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 hidden group-hover:block">
                      <div className="flex flex-col gap-2">
                        <Link to={`/profile/${userData?.username}`} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                          <User className="w-5 h-5" />
                          <span>Profile</span>
                        </Link>
                        <Link to="/liked-videos" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                          <Heart className="w-5 h-5" />
                          <span>Liked Videos</span>
                        </Link>
                        <Link to="/watch-history" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                          <History className="w-5 h-5" />
                          <span>Watch History</span>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-red-600">
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>*
                  </Link>*/}
                </div>
              )}

            
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;