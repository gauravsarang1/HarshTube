import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, } from 'react-router-dom';
import axios from 'axios';
import { X, Loader2, Plus, Check, } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const AddToPlaylist = ({onclick}) => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        console.log('No user found in localStorage');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchUploadedVideos(1);
    }
  }, [user]);

  const fetchUploadedVideos = async (page) => {
    try {
      if (!user) {
        console.log('User is not available yet');
        return;
      }

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
        `${API_BASE_URL}/videos/all-uploaded-videos/${user.username}?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data.data);
      const { videos, hasMore: more } = response.data.data;

      if (page === 1) {
        setUploadedVideos(videos);
      } else {
        setUploadedVideos(prev => {
          const existingIds = new Set(prev.map(v => v._id));
          const newVideos = videos.filter(v => !existingIds.has(v._id));
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
        setError('Failed to fetch videos');
        console.error('Error fetching videos:', err);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;
      
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000;

      if (scrollPosition >= threshold) {
        fetchUploadedVideos(currentPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, user]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(prev => prev?._id === video._id ? null : video);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/playlist/add/${selectedVideo._id}/${playlistId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data.data);
      //navigate(`/playlist/${playlistId}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add video to playlist');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onclick();
    //window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
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

  return (
    <div className="relative min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      {/* Selected Video Container */}
      <div className="mb-8 max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          Selected Video
        </h2>
        {selectedVideo ? (
          <div className="max-w-md">
            <div className="relative group">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-2 right-2 p-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:scale-110 shadow-md transition-all duration-300"
                >
                  <X size={16} />
                </button>
              </div>
              <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                {selectedVideo.title}
              </h3>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No video selected. Select a video from below to add to your playlist.
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedVideo}
            className={`px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg
              ${saving || !selectedVideo
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 hover:shadow-xl'}
            `}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </div>
            ) : (
              'Add to Playlist'
            )}
          </button>
        </div>
      </div>

      {/* Uploaded Videos Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          Your Videos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-6 max-w-4xl mx-auto">
          {uploadedVideos.map(video => (
            <div
              key={video._id}
              onClick={() => handleVideoSelect(video)}
              className={`relative group cursor-pointer max-w-[400px] mx-auto w-full bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${selectedVideo?._id === video._id ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                  {selectedVideo?._id === video._id ? (
                    <Check className="w-10 h-10 text-green-500 bg-white rounded-full p-1 shadow-lg" />
                  ) : null}
                </div>
              </div>
              <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                {video.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Loading Indicator */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {/* No More Videos Message */}
        {!hasMore && uploadedVideos.length > 0 && (
          <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
            No more videos to load
          </div>
        )}

        {/* Empty State */}
        {!loading && uploadedVideos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No videos found. Upload some videos first.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
            >
              <Plus size={20} />
              Upload Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToPlaylist; 