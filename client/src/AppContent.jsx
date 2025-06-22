import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import Header from './components/header/header';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import Home from './components/home/home';
import UploadVideo from './components/upload/UploadVideo';
import PlayVideo from './components/video/PlayVideo';
import UploadedVideos from './components/video/UploadedVideos';
import PlaylistVideos from './components/playlist/PlaylistVideos';
import CreatePlaylist from './components/playlist/CreatePlaylist';
import MiniPlayer from './components/video/MiniPlayer';
import { useSelector, useDispatch } from 'react-redux';
import { setIsActive } from './features/body/miniPlayerSlice';
import axios from 'axios';
import AddToPlaylist from './components/playlist/AddToPlaylist';
import Settings from './components/settings/Settings';
import Result from './components/search/Result';
import LikedVideos from './components/video/LikedVideos';
import WatchHistory from './components/video/WatchHistory';
import Toast from './components/ui/toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isActive } = useSelector(state => state.miniPlayer);

  const clearAuthState = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  };

  const updateAuthState = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const user = localStorage.getItem('user');
        
        // If we have both token and user data, we can be confident the user is authenticated
        if (user) {
          try {
            const userData = JSON.parse(user);
            if (userData && userData.id) {
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            }
          } catch (parseError) {
            clearAuthState();
            setIsLoading(false);
            return;
          }
        }

        const response = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.data) {
          // Store the user data for future use
          const userData = {
            id: response.data.data._id,
            username: response.data.data.username,
            fullName: response.data.data.fullName,
            email: response.data.data.email,
            coverImage: response.data.data.coverImage,
            avatar: response.data.data.avatar,
            createdAt: response.data.data.createdAt,
            updatedAt: response.data.data.updatedAt
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setIsAuthenticated(true);
        } else {
          clearAuthState();
        }
      } catch (err) {
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Make auth functions available globally
  useEffect(() => {
    window.updateAuthState = updateAuthState;
    window.clearAuthState = clearAuthState;
    
    return () => {
      delete window.updateAuthState;
      delete window.clearAuthState;
    };
  }, []);

  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {!isPublicRoute && <Header />}
      <main className={!isPublicRoute ? "pt-7" : ""}>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/upload" element={isAuthenticated ? <UploadVideo /> : <Navigate to="/login" />} />
            <Route path="/watch/:videoId" element={<PlayVideo />} />
            <Route path="/home" element={<Home />} />
            <Route path="/my-videos" element={isAuthenticated ? <UploadedVideos /> : <Navigate to="/login" />} />
            <Route path="/playlist/:playlistId" element={<PlaylistVideos />} />
            <Route path="/create-playlist" element={isAuthenticated ? <CreatePlaylist /> : <Navigate to="/login" />} />
            <Route path="/playlist/:playlistId/add-videos" element={isAuthenticated ? <AddToPlaylist /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/search" element={<Result />} />
            <Route path="/liked-videos" element={isAuthenticated ? <LikedVideos /> : <Navigate to="/login" />} />
            <Route path="/watch-history" element={isAuthenticated ? <WatchHistory /> : <Navigate to="/login" />} />
          </Routes>
        )}
      </main>
      {isActive && !isPublicRoute && <MiniPlayer />}
      <Toast />
    </div>
  );
};

export default AppContent;
