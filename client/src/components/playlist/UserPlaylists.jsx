import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Loader2, Folder, Plus, Trash2, Save, Pencil, X, Check } from 'lucide-react';
import CreatePlaylist from './CreatePlaylist';
import { motion, AnimatePresence } from 'framer-motion';

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
        `http://localhost:5050/api/v1/playlist/user/${username}/playlists?page=${page}`,
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

      await axios.delete(`http://localhost:5050/api/v1/playlist/user/${playlistId}`, {
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
        `http://localhost:5050/api/v1/playlist/user/${playlistId}`,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-lg"></div>
          <div className="mt-2 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Header component
  const Header = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex flex-wrap items-center gap-3 md:gap-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          {error ? 'My Playlists' : 'Your Playlists'}
        </h1>
        <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
          {playlistCount} playlists
        </span>
      </div>
      {isOwnProfile && (
        <Link
        to="/create-playlist"
        className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
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
        className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
        onClick={isEditing ? (e) => e.preventDefault() : undefined}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Play button - only show when not editing */}
          {!isEditing && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Play className="w-14 h-14 text-white" />
            </div>
          )}
          
          {/* Delete button - only show on hover and when owner */}
          {isOwner && !isEditing && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDeletePlaylist(playlist._id);
              }}
              className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hover:bg-white dark:hover:bg-gray-800"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex justify-between items-center gap-2 mb-2">
            {isEditing ? (
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={editPlaylistName}
                  onChange={(e) => setEditPlaylistName(e.target.value)}
                  className="flex-1 font-bold text-lg text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
                  placeholder="Enter playlist name"
                  disabled={isUpdating}
                  autoFocus
                />
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUpdatePlaylistName(playlist._id);
                    }}
                    disabled={isUpdating}
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white p-1.5 rounded-full transition-colors"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      cancelEditing();
                    }}
                    disabled={isUpdating}
                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white p-1.5 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate flex-1">
                  {playlist.name}
                </h3>
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      startEditing(playlist);
                    }}
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </button>
                )}
              </>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
              {Array.isArray(playlist.videos) ? playlist.videos.length : 0} videos
            </span>
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
              {formatDate(playlist.createdAt)}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <Header />
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchPlaylists(1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 px-4 sm:px-6 lg:px-8">
      <Header />
      
      {/* Playlists Grid */}
      {!isEmpty && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* No More Playlists Message */}
      {!hasMore && playlistCount > 0 && (
        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
          No more playlists to load
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            No playlists found.
          </p>
          <Link
            to="/create-playlist"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Create Your First Playlist
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserPlaylists;