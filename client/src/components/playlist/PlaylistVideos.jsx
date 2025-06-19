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
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 ">
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
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button
            onClick={() => fetchPlaylistVideos(1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex md:flex-row">
        <div className="min-h-screen pt-10 mt-5 px-4 sm:px-6 lg:px-8 w-full">
        {/* Playlist Header */}
        <div className="mb-8 flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {playlist?.name || 'Playlist'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
                {Array.isArray(videos) && videos.length} {Array.isArray(videos) && videos.length === 1 ? 'video' : 'videos'}
            </p>
            </div>
            {ownProfile && (
            <button
                onClick={() => setShowAddToPlaylist(true)}
                className="hidden md:flex  gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
            <Plus size={20} />
            Add Videos
            </button>
            )}
            <Link
                to={`/playlist/${playlistId}/add-videos`}
                className="flex md:hidden items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
            <Plus size={20} />
            Add Videos
            </Link>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 ${showAddToPlaylist?'lg:grid-cols-3 md:grid-cols-2':'lg:grid-cols-4 md:grid-cols-3'}`}>
            {Array.isArray(videos) && videos.map((video) => (
            <Link
                key={video._id}
                to={`/watch/${video._id}`}
                className="group max-w-[400px] mx-auto w-full"
            >
                <div className="relative aspect-video rounded-lg overflow-hidden">
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
                <div className="mt-2">
                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                    {video.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                    {playlist.owner?.avatar && (
                        <img
                        src={playlist.owner.avatar}
                        alt={playlist.owner.fullName}
                        className="w-6 h-6 rounded-full"
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
            {/*<button
                onClick={() => navigate(`/playlist/${playlistId}/add-videos`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
            >
                <Plus size={20} />
                Add Videos
            </button>*/}
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