import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { X, Loader2, Plus, Check, Music, Video, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '../../utils/toast';

const AddToPlaylist = ({ onclick }) => {
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
  const [success, setSuccess] = useState(false);

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
        showError('User is not available yet');
        return;
      }

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await api.get(
        `/videos/all-uploaded-videos/${user.username}?page=${page}`
      );
      if(response.data.statusCode === 200 || response.data.statusCode === 201) {
        showSuccess('Videos fetched successfully');
      } else {
        showError(response.data.message);
      }
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
        showError('Please login to view your uploaded videos');
      } else {
        showError('Failed to fetch videos');
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, user]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(prev => prev?._id === video._id ? null : video);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.patch(
        `/playlist/add/${selectedVideo._id}/${playlistId}`
      );
      if(response.data.statusCode === 200 || response.data.statusCode === 201) {
        showSuccess('Video added to playlist successfully');
      } else {
        showError(response.data.message);
      }
      setSuccess(true);
      setTimeout(() => {
        onclick();
      }, 1500);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add video to playlist');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onclick();
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleCancel}
          className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 mb-6 transition-all duration-300"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Playlist</span>
        </motion.button>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Selected Video Container */}
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Video size={24} className="md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                Selected Video
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                Choose a video to add to your playlist
              </p>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700 flex items-center gap-3"
                >
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-green-800 dark:text-green-200 font-semibold">Video Added Successfully!</p>
                    <p className="text-green-600 dark:text-green-400 text-sm">Redirecting you back...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {selectedVideo ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
              >
                <div className="relative group">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                    <img
                      src={selectedVideo.thumbnail}
                      alt={selectedVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg text-sm font-medium">
                      {formatDuration(selectedVideo.duration)}
                    </div>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="absolute top-2 right-2 p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:scale-110 shadow-lg transition-all duration-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {selectedVideo.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatNumber(selectedVideo.views)} {selectedVideo.views === 1 ? 'view' : 'views'}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                  <Video size={24} className="md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  No video selected. Select a video from below to add to your playlist.
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !selectedVideo}
                className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg relative overflow-hidden group
                  ${saving || !selectedVideo
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:shadow-xl hover:scale-105'
                  }
                `}
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                      <span>Add to Playlist</span>
                    </>
                  )}
                </div>
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </motion.div>
          </div>

          {/* Uploaded Videos Section */}
          <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                <Music size={24} className="md:w-8 md:h-8 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-cyan-800 dark:from-white dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">
                Your Videos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                Select from your uploaded videos
              </p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-700 flex items-center gap-3"
                >
                  <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Videos Grid */}
            {uploadedVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {uploadedVideos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    onClick={() => handleVideoSelect(video)}
                    className={`relative group cursor-pointer max-w-[400px] mx-auto w-full bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm p-3 transition-all duration-300 hover:shadow-xl ${selectedVideo?._id === video._id ? 'ring-2 ring-purple-500 shadow-xl' : ''}`}
                  >
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg text-sm font-medium">
                        {formatDuration(video.duration)}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                        {selectedVideo?._id === video._id ? (
                          <Check className="w-10 h-10 text-green-500 bg-white rounded-full p-1 shadow-lg" />
                        ) : (
                          <Plus className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                      </div>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatNumber(video.views)} {video.views === 1 ? 'view' : 'views'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 md:py-16"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                  <Video size={24} className="md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">No videos found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6">Upload some videos first to add them to your playlist.</p>
                <button
                  onClick={() => navigate('/upload')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus size={16} />
                  Upload Video
                </button>
              </motion.div>
            )}

            {/* Loading Indicator */}
            {loadingMore && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-8"
              >
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              </motion.div>
            )}

            {/* No More Videos Message */}
            {!hasMore && uploadedVideos.length > 0 && (
              <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                No more videos to load
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddToPlaylist; 