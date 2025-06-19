import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Loader2, Folder, Plus, Trash2, Save, Pencil, X, Check } from 'lucide-react';
import CreatePlaylist from './CreatePlaylist';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsOwnProfile(user.username === username);
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
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  // Fetch playlists with improved error handling
  const fetchPlaylists = useCallback(async (page) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/playlist/user/${username}/playlists?page=${page}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
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
      } else {
        setError('No playlists found');
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

      if (scrollPosition >= threshold && !loadingMore && hasMore) {
        fetchPlaylists(currentPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, fetchPlaylists]);

  // Delete playlist handler
  const handleDeletePlaylist = useCallback(async (playlistId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`${API_BASE_URL}/playlist/user/${playlistId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Optimistically update UI
      setPlaylists(prev => prev.filter(p => p._id !== playlistId));
    } catch (error) {
      setError('Error deleting playlist');
      console.error('Error deleting playlist:', error);
    }
  }, [navigate]);

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
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/playlist/user/${playlistId}`,
        { name: editPlaylistName.trim() },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

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
      setError('Failed to update playlist name');
    } finally {
      setIsUpdating(false);
    }
  }, [editPlaylistName, navigate, cancelEditing]);

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

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="animate-pulse bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-xl"></div>
          <div className="mt-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Header component
  const Header = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
      <div className="flex flex-wrap items-center gap-3 md:gap-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          {error ? 'My Playlists' : 'Your Playlists'}
        </h1>
        <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 px-3 py-1.5 rounded-full">
          {playlistCount} playlists
        </span>
      </div>
      {isOwnProfile && (
        <Link
          to="/create-playlist"
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <Plus size={20} className="sm:size-5" />
          <span className="text-sm sm:text-base font-medium">Add</span>
        </Link>
      )}
    </div>
  );

  // Playlist card component
  const PlaylistCard = ({ playlist }) => {
    const isOwner = currentUser?.id === playlist.owner?._id;
    const isEditing = editingPlaylistId === playlist._id;

    return (
      <Link
        key={playlist._id}
        to={isEditing ? '#' : `/playlist/${playlist._id}`}
        className="group block bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div className="relative aspect-video rounded-xl overflow-hidden shadow border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-blue-50/30 to-purple-50/10 dark:from-gray-800/30 dark:to-gray-900/10 mb-2">
          {playlist.PlaylistThumbnail ? (
            <img
              src={playlist.PlaylistThumbnail}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
              <Folder className="w-16 h-16 text-white opacity-60" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editPlaylistName}
                onChange={e => setEditPlaylistName(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-blue-200 dark:border-blue-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-400"
                autoFocus
              />
              <button
                onClick={() => handleUpdatePlaylistName(playlist._id)}
                disabled={isUpdating}
                className="p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:scale-110 transition-all duration-300"
              >
                <Check size={18} />
              </button>
              <button
                onClick={cancelEditing}
                className="p-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:scale-110 transition-all duration-300"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
              {playlist.name}
            </h2>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span>{playlist.videos?.length || 0} videos</span>
            <span>•</span>
            <span>{formatDate(playlist.createdAt)}</span>
          </div>
          {isOwner && !isEditing && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={e => { e.preventDefault(); startEditing(playlist); }}
                className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md hover:scale-110 transition-all duration-300"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={e => { e.preventDefault(); handleDeletePlaylist(playlist._id); }}
                className="p-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:scale-110 transition-all duration-300"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </Link>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
        <div className="sm:max-w-7xl sm:mx-auto sm:bg-gradient-to-br sm:from-white sm:to-gray-50/80 sm:dark:from-gray-800 sm:dark:to-gray-900/80 sm:p-8 sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-200/50 sm:dark:border-gray-700/50 sm:backdrop-blur-sm">
          <Header />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
        <div className="sm:max-w-7xl sm:mx-auto sm:bg-gradient-to-br sm:from-white sm:to-gray-50/80 sm:dark:from-gray-800 sm:dark:to-gray-900/80 sm:p-8 sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-200/50 sm:dark:border-gray-700/50 sm:backdrop-blur-sm">
          <Header />
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-500 dark:text-red-400 font-semibold text-lg mb-6">{error}</p>
            <button
              onClick={() => fetchPlaylists(1)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <div className="sm:max-w-7xl sm:mx-auto sm:bg-gradient-to-br sm:from-white sm:to-gray-50/80 sm:dark:from-gray-800 sm:dark:to-gray-900/80 sm:p-8 sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-200/50 sm:dark:border-gray-700/50 sm:backdrop-blur-sm">
        <Header />
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">No playlists found.</p>
            {isOwnProfile && (
              <Link
                to="/create-playlist"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Create Playlist
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map(playlist => (
              <PlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        )}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPlaylists;