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

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { isActive } = useSelector(state => state.miniPlayer);

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
        if (user) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5050/api/v1/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.data) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);


  useEffect(() => {
    if (!isAuthenticated) dispatch(setIsActive(false));
  }, [location.pathname]);

  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {!isPublicRoute && <Header />}
      <main className={!isPublicRoute ? "pt-7" : ""}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
          <Route path="/profile/:username" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/upload" element={isAuthenticated ? <UploadVideo /> : <Navigate to="/login" />} />
          <Route path="/watch/:videoId" element={isAuthenticated ? <PlayVideo /> : <Navigate to="/login" />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/my-videos" element={isAuthenticated ? <UploadedVideos /> : <Navigate to="/login" />} />
          <Route path="/playlist/:playlistId" element={isAuthenticated ? <PlaylistVideos /> : <Navigate to="/login" />} />
          <Route path="/create-playlist" element={isAuthenticated ? <CreatePlaylist /> : <Navigate to="/login" />} />
          <Route path="/playlist/:playlistId/add-videos" element={isAuthenticated ? <AddToPlaylist /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/profile/:username" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/search" element={isAuthenticated ? <Result /> : <Navigate to="/login" />} />
          <Route path="/liked-videos" element={isAuthenticated ? <LikedVideos /> : <Navigate to="/login" />} />
          <Route path="/watch-history" element={isAuthenticated ? <WatchHistory /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      {isActive && isAuthenticated && <MiniPlayer />}

    </div>
  );
};

export default AppContent;
