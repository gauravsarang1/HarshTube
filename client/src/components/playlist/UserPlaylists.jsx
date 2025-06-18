import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Loader2, Folder, Plus, Trash2 } from 'lucide-react';
import CreatePlaylist from './CreatePlaylist';

const UserPlaylists = () => {
  const { username } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();


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

      const response = await axios.get(`http://localhost:5050/api/v1/playlist/user/${username}/playlists?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const { playlists: playlistList, hasMore: more } = response.data.data;
      
      if (page === 1) {
        setPlaylists(playlistList);
      } else {
        // Ensure no duplicate playlists are added
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
  }, [username, navigate, ]);

  useEffect(() => {
    fetchPlaylists(1);
  }, [fetchPlaylists]);

  const handleDeletePlaylist = async(playlistId) => {
    try {
      const token = localStorage.getItem('token');
      if(!token){
        navigate('/login');
        return;
      }
      const response = await axios.delete(`http://localhost:5050/api/v1/playlist/user/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchPlaylists(1);
    } catch (error) {
      setError('Error deleting playlist');
      console.error('Error deleting playlist:', error);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000; // Load more when 1000px from bottom

      if (scrollPosition >= threshold) {
        if (!loadingMore && hasMore) {
          fetchPlaylists(currentPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, fetchPlaylists]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handlePlaylistCreated = (newPlaylist) => {
    setPlaylists(prev => [newPlaylist, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-lg"></div>
              <div className="mt-2 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
        <div className='flex items-center gap-2 md:gap-4'>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Playlists</h1>
          <p className="text-white bg-blue-500 px-2 py-1 rounded-lg">
            { Array.isArray(playlists) && playlists.length} {Array.isArray(playlists) && playlists.length === 1 ? 'playlist' : 'playlists'}
          </p>
        </div>
        <Link
            to={`/create-playlist`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Add
          </Link>
      </div>
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button
            onClick={() => fetchPlaylists(1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div className='flex items-center gap-2 md:gap-4'>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Playlists</h1>
          <p className="text-white bg-blue-500 px-2 py-1 rounded-lg">
            { Array.isArray(playlists) && playlists.length} {Array.isArray(playlists) && playlists.length === 1 ? 'playlist' : 'playlists'}
          </p>
        </div>
        <Link
            to={`/create-playlist`}
            className="flex items-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            Add
          </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists && Array.isArray(playlists) && playlists.map((playlist) => (
          <Link
            key={playlist._id}
            to={`/playlist/${playlist._id}`}
            className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              {playlist.PlaylistThumbnail ? (
                <img
                  src={playlist.PlaylistThumbnail}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600">
                  <Folder className="w-16 h-16 text-white opacity-60" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-14 h-14 text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-200" />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDeletePlaylist(playlist._id);
                }}
                className="absolute top-3 right-3 bg-white dark:bg-gray-800 shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
            {/* Details */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">{playlist.name}</h3>
              <div className="flex flex-wrap gap-2 mb-1">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-xs">
                  {Array.isArray(playlist.videos) ? playlist.videos.length : 0} videos
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                  {formatDate(playlist.createdAt)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Loading Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}

      {/* No More Playlists Message */}
      {!hasMore && playlists && Array.isArray(playlists) && playlists.length > 0 && (
        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
          No more playlists to load
        </div>
      )}

      {/* Empty State */}
      {!loading && !playlists && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No playlists found.</p>
          <Link
            to={`/create-playlist`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
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