import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../api/axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Loader2, Folder, Plus, Trash2, Save, Pencil, X, Check, Music, TrendingUp, Eye, AlertTriangle } from 'lucide-react';
import CreatePlaylist from './CreatePlaylist';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '../../utils/toast';

const UserPlaylists = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [editPlaylistName, setEditPlaylistName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalDuration: 0,
    averageVideos: 0
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsOwnProfile(user?.username === username);
  }, [username]);

  // Memoized values
  const playlistCount = useMemo(() => 
    Array.isArray(playlists) ? playlists.length : 0, 
    [playlists]
  );

  const isEmpty = useMemo(() => 
    !loading && (!playlists || playlists.length === 0), 
    [loading, playlists]
  );

  // Initialize user authentication
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Calculate stats
  useEffect(() => {
    if (playlists.length > 0) {
      const totalVideos = playlists.reduce((sum, playlist) => sum + (playlist.videos?.length || 0), 0);
      const totalDuration = playlists.reduce((sum, playlist) => {
        const playlistDuration = playlist.videos?.reduce((pSum, video) => pSum + (video.duration || 0), 0) || 0;
        return sum + playlistDuration;
      }, 0);
      const averageVideos = Math.round(totalVideos / playlists.length);
      
      setStats({
        totalVideos,
        totalDuration,
        averageVideos
      });
    }
  }, [playlists]);

  // Fetch playlists with improved error handling
  const fetchPlaylists = useCallback(async (page) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get(
        `/playlist/user/${username}/playlists?page=${page}`
      );
      if(response.data.statusCode ===  200 || response.data.statusCode === 201) {
        showSuccess('Playlists fetched successfully');
      } else {
        showError(response.data.message);
      }
      
      const { playlists: playlistList, hasMore: more } = response.data.data;
      
      if (page === 1) {
        setPlaylists(playlistList);
      } else {
        setPlaylists(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newPlaylists = playlistList.filter(p => !existingIds.has(p._id));
          return [...prev, ...newPlaylists];
        });
      }
      
      setHasMore(more);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        showError('Please login to view your playlists');
      } else {
        showError('No playlists found');
        console.error('Error fetching playlists:', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [username, navigate]);

  // Initial data fetch
  useEffect(() => {
    fetchPlaylists(1);
  }, [fetchPlaylists]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000;

      if (scrollPosition >= threshold && !loadingMore && hasMore && !loading) {
        fetchPlaylists(currentPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, loading, fetchPlaylists]);

  // Delete playlist handler
  const handleDeletePlaylist = useCallback(async (playlistId) => {
    if (!window.confirm('Are you sure you want to delete this playlist? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/playlist/${playlistId}`);

      showSuccess('Playlist deleted successfully');
      
      // Optimistically update UI
      setPlaylists(prev => prev.filter(p => p._id !== playlistId));
    } catch (error) {
      showError('Error deleting playlist');
      console.error('Error deleting playlist:', error);
    }
  }, []);

  // Edit handlers
  const startEditing = useCallback((playlist) => {
    setEditingPlaylistId(playlist._id);
    setEditPlaylistName(playlist.name);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingPlaylistId(null);
    setEditPlaylistName('');
  }, []);

  const handleUpdatePlaylistName = useCallback(async (playlistId) => {
    if (!editPlaylistName.trim()) return;
    
    setIsUpdating(true);
    try {
      await api.patch(
        `/playlist/${playlistId}`,
        { name: editPlaylistName.trim() }
      );

      showSuccess('Playlist name updated successfully');

      // Optimistically update UI
      setPlaylists(prevPlaylists =>
        prevPlaylists.map(playlist =>
          playlist._id === playlistId
            ? { ...playlist, name: editPlaylistName.trim() }
            : playlist
        )
      );

      cancelEditing();
    } catch (error) {
      console.error('Error updating playlist name:', error);
      showError('Failed to update playlist name');
    } finally {
      setIsUpdating(false);
    }
  }, [editPlaylistName, cancelEditing]);

  // Format date helper
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  }, []);

  const formatTotalDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }, (_, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="animate-pulse bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
        >
          <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-xl"></div>
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Header component
  const Header = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 md:mb-8"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
        {/* Title and Stats */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Music size={18} className="md:w-5 md:h-5 text-white" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                Playlists
              </h1>
            </div>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm md:text-base font-semibold shadow-sm border border-purple-200/50 dark:border-purple-700/50"
            >
              {playlistCount} playlists
            </motion.span>
          </div>
          
          {/* Stats Cards */}
          {playlists.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 md:p-4 rounded-xl border border-blue-200/50 dark:border-blue-700/50 shadow-sm"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Eye size={16} className="md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Total Videos</p>
                    <p className="text-lg md:text-xl font-bold text-blue-700 dark:text-blue-300">{formatNumber(stats.totalVideos)}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 md:p-4 rounded-xl border border-purple-200/50 dark:border-purple-700/50 shadow-sm"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Clock size={16} className="md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Total Duration</p>
                    <p className="text-lg md:text-xl font-bold text-purple-700 dark:text-purple-300">{formatTotalDuration(stats.totalDuration)}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 md:p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <TrendingUp size={16} className="md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Avg. Videos</p>
                    <p className="text-lg md:text-xl font-bold text-emerald-700 dark:text-emerald-300">{formatNumber(stats.averageVideos)}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
        
        {/* Create Playlist Button */}
        {isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/create-playlist"
              className="group relative overflow-hidden flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-400/50 dark:border-purple-500/50"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon */}
              <Plus size={18} className="md:w-5 md:h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              
              {/* Text */}
              <span className="text-sm md:text-base font-medium relative z-10">Create Playlist</span>
              
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  // Playlist card component
  const PlaylistCard = ({ playlist, index }) => {
    const isOwner = currentUser?.id === playlist.owner?._id;
    const isEditing = editingPlaylistId === playlist._id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, y: -4 }}
      >
        <Link
          key={playlist._id}
          to={isEditing ? '#' : `/playlist/${playlist._id}`}
          className="group block bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-4 transition-all duration-300 overflow-hidden"
        >
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-purple-50/30 to-pink-50/10 dark:from-gray-800/30 dark:to-gray-900/10 mb-3">
            {playlist.PlaylistThumbnail ? (
              <img
                src={playlist.PlaylistThumbnail}
                alt={playlist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-600">
                <Music className="w-16 h-16 text-white opacity-60" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
              <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editPlaylistName}
                  onChange={e => setEditPlaylistName(e.target.value)}
                  className="flex-1 px-3 py-2 border-2 border-purple-200 dark:border-purple-700 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-400 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => handleUpdatePlaylistName(playlist._id)}
                  disabled={isUpdating}
                  className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:scale-110 transition-all duration-300"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:scale-110 transition-all duration-300"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                {playlist.name}
              </h2>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{playlist.videos?.length || 0} videos</span>
              <span>•</span>
              <span>{formatDate(playlist.createdAt)}</span>
            </div>
            {isOwner && !isEditing && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={e => { e.preventDefault(); startEditing(playlist); }}
                  className="p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md hover:scale-110 transition-all duration-300"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={e => { e.preventDefault(); handleDeletePlaylist(playlist._id); }}
                  className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:scale-110 transition-all duration-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
        <div className="max-w-7xl mx-auto">
          <Header />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
        <div className="max-w-7xl mx-auto">
          <Header />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 md:py-16"
          >
            <AlertTriangle size={48} className="text-red-500 mb-4" />
            <p className="text-red-500 dark:text-red-400 font-semibold text-lg mb-6">{error}</p>
            <button
              onClick={() => fetchPlaylists(1)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <div className="max-w-7xl mx-auto">
        <Header />
        {isEmpty ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 md:py-16"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <Music size={24} className="md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">No playlists found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6">Start creating playlists to organize your favorite videos!</p>
            {isOwnProfile && (
              <Link
                to="/create-playlist"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus size={16} />
                Create Your First Playlist
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {playlists.map((playlist, index) => (
              <PlaylistCard key={playlist._id} playlist={playlist} index={index} />
            ))}
          </div>
        )}
        {loadingMore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserPlaylists;