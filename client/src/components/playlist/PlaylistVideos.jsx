import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Loader2, Plus } from 'lucide-react';
import AddToPlaylist from './AddToPlaylist';

const PlaylistVideos = () => {
  const { playlistId } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);;
  const [playlist, setPlaylist] = useState({
    name: '',
    description: '',
    totalVideos: 0,
    owner: {}
  });
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const navigate = useNavigate();
  const [ownProfile, setOwnProfile] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user.username === playlist.owner.username) {
      setOwnProfile(true);
    }
  }, [playlist]);

  const fetchPlaylistVideos = useCallback(async (page) => {
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

      const response = await axios.get(`http://localhost:5050/api/v1/playlist/user/${playlistId}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const { playlist, hasMore: more, totalVideos } = response.data.data;
      const {name, description, videos: videoList, owner } = playlist;

      setPlaylist({
        name,
        description,
        totalVideos,
        owner
      });

      if (page === 1) {
        setVideos(videoList);
      } else {
        // Ensure no duplicate videos are added
        setVideos(prev => {
          const existingIds = new Set(prev.map(v => v._id));
          const newVideos = videoList.filter(v => !existingIds.has(v._id));
          return [...prev, ...newVideos];
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
        setError('Failed to fetch playlist videos. Please try again later.');
        console.error('Error fetching playlist videos:', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [playlistId, navigate]);

  useEffect(() => {
    fetchPlaylistVideos(1);
  }, [fetchPlaylistVideos]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000;

      if (scrollPosition >= threshold) {
        if (!loadingMore && hasMore) {
          fetchPlaylistVideos(currentPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, fetchPlaylistVideos]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-xl"></div>
              <div className="mt-4 space-y-3">
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
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80 flex items-center justify-center">
        <div className="max-w-md w-full bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm text-center">
          <p className="text-red-500 dark:text-red-400 font-semibold text-lg">{error}</p>
          <button
            onClick={() => fetchPlaylistVideos(1)}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex md:flex-row min-h-screen pt-10 mt-5 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
        {/* Playlist Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
              {playlist?.name || 'Playlist'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
              {Array.isArray(videos) && videos.length} {Array.isArray(videos) && videos.length === 1 ? 'video' : 'videos'}
            </p>
          </div>
          {ownProfile && (
            <button
              onClick={() => setShowAddToPlaylist(true)}
              className="hidden md:flex gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <Plus size={20} />
              Add Videos
            </button>
          )}
          <Link
            to={`/playlist/${playlistId}/add-videos`}
            className="flex md:hidden items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            <Plus size={20} />
            Add Videos
          </Link>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 ${showAddToPlaylist?'lg:grid-cols-3 md:grid-cols-2':'lg:grid-cols-4 md:grid-cols-3'}`}>
          {Array.isArray(videos) && videos.map((video) => (
            <Link
              key={video._id}
              to={`/watch/${video._id}`}
              className="group max-w-[400px] mx-auto w-full"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
                  {formatDuration(video.duration)}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-lg">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    {playlist.owner?.avatar && (
                      <img
                        src={playlist.owner.avatar}
                        alt={playlist.owner.fullName}
                        className="w-6 h-6 rounded-full shadow"
                      />
                    )}
                    <span>{playlist.owner?.fullName || 'Unknown User'}</span>
                  </div>
                  <span>•</span>
                  <span>{video.views} {video.views === 1 ? 'view' : 'views'}</span>
                  <span>•</span>
                  <span>{formatDate(video.createdAt)}</span>
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

        {/* No More Videos Message */}
        {!hasMore && Array.isArray(videos) && videos.length > 0 && (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            No more videos to load
          </div>
        )}

        {/* Empty State */}
        {!loading && (!Array.isArray(videos) || videos.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">This playlist is empty.</p>
          </div>
        )}
      </div>
      {showAddToPlaylist && (
        <AddToPlaylist
          onclick={() => setShowAddToPlaylist(false)}
        />
      )}
    </div>
  );
};

export default PlaylistVideos; 