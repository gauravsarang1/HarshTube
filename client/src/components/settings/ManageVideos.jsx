import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Video, Upload, Trash2, AlertTriangle, Loader, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import userApi from './api';
import { showSuccess, showError } from '../../utils/toast';

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // 'single' or 'all'
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);

  const observer = useRef();
  const lastVideoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchPageOfVideos = async (pageNum) => {
    try {
        const token = localStorage.getItem('token');
        const data = await userApi.getUserVideos(token, pageNum);
        
        const {videos, hasMore, totalPages, totalVideos} = data;

        setVideos(prev => pageNum === 1 ? videos : [...prev, ...videos]);
        setHasMore(hasMore);
        setTotalPages(totalPages);
        setTotalVideos(totalVideos);
        setError(null);
    } catch (err) {
        setError(err.message || 'Failed to fetch videos.');
    } finally {
        setLoading(false);
        setLoadingMore(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchPageOfVideos(1);
  }, []);
  
  useEffect(() => {
    if (page > 1) {
        setLoadingMore(true);
        fetchPageOfVideos(page);
    }
  }, [page]);

  useEffect(() => {
    if(searchTerm.trim() !== '') {
      setFilteredVideos(videos.filter(video => video.title.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setFilteredVideos(videos);
    }
  }, [searchTerm, videos]);

  const handleDelete = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await userApi.deleteVideo(token, videoId);
      if(response?.data?.statusCode === 200 || response?.statusCode === 200) {
        setVideos(videos.filter(video => video._id !== videoId));
        setFilteredVideos(filteredVideos.filter(video => video._id !== videoId));
        showSuccess('Video deleted successfully');
        setError(null);
      } 
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete video.';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
        setShowDeleteConfirm(null);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const token = localStorage.getItem('token');
      await userApi.deleteAllVideos(token);
      setVideos([]);
      setFilteredVideos([]);
      showSuccess('All videos deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete all videos.';
      showError(errorMessage);
      setError(errorMessage);
    } finally {
        setShowDeleteConfirm(null);
    }
  };


  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  

  const DeleteConfirmationModal = ({ onConfirm, onCancel }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Deletion</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to proceed? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
        <AnimatePresence>
            {showDeleteConfirm && (
                <DeleteConfirmationModal 
                    onCancel={() => setShowDeleteConfirm(null)}
                    onConfirm={() => {
                        if (showDeleteConfirm === 'all') handleDeleteAll();
                        else handleDelete(showDeleteConfirm);
                    }}
                />
            )}
        </AnimatePresence>
        
        {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-auto md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDeleteConfirm('all')}
            disabled={videos.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete All</span>
          </motion.button>
          <Link to="/upload" className="flex-1 md:flex-none">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Upload className="w-5 h-5" />
              <span>Upload New</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
        </div>
      ) : filteredVideos.length === 0 || !Array.isArray(filteredVideos) ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800/20 p-6 rounded-2xl">
          <Video className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-semibold">
            {searchTerm ? "No videos match your search." : "You haven't uploaded any videos yet."}
          </p>
          {!searchTerm && (
            <Link to="/upload" className="mt-4">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                <Upload className="w-5 h-5" />
                <span>Upload Your First Video</span>
                </motion.button>
            </Link>
          )}
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {Array.isArray(filteredVideos) && filteredVideos.map((video, index) => {
                    if (filteredVideos.length === index + 1) {
                       return (
                        <motion.div
                            ref={lastVideoElementRef}
                            key={video._id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring' }}
                            className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden group"
                        >
                            <div className="relative aspect-video">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-medium">
                                {formatDuration(video.duration)}
                            </div>
                            </div>
                            <div className="p-4">
                            <h4 className="font-bold text-lg line-clamp-2 text-gray-900 dark:text-white mb-2">{video.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">{video.description}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50 pt-3">
                                <span>{video.views} views</span>
                                <span>{formatDate(video.createdAt)}</span>
                            </div>
                            </div>
                            <div className="p-4 pt-0">
                                <motion.button
                                onClick={() => setShowDeleteConfirm(video._id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                <Trash2 className="w-4 h-4" />
                                Delete
                                </motion.button>
                            </div>
                        </motion.div>
                       )
                    } else {
                        return (
                            <motion.div
                                key={video._id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: 'spring' }}
                                className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm overflow-hidden group"
                            >
                                <div className="relative aspect-video">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-medium">
                                    {formatDuration(video.duration)}
                                </div>
                                </div>
                                <div className="p-4">
                                <h4 className="font-bold text-lg line-clamp-2 text-gray-900 dark:text-white mb-2">{video.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">{video.description}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50 pt-3">
                                    <span>{video.views} views</span>
                                    <span>{formatDate(video.createdAt)}</span>
                                </div>
                                </div>
                                <div className="p-4 pt-0">
                                    <motion.button
                                    onClick={() => setShowDeleteConfirm(video._id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                    >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                    </motion.button>
                                </div>
                            </motion.div>
                        )
                    }
                })}
            </AnimatePresence>
            </div>
            {/* Loading more spinner */}
            <div className="flex justify-center items-center py-8">
                {loadingMore && <Loader className="w-8 h-8 animate-spin text-blue-500" />}
                {!hasMore && videos.length > 0 && <p className="text-sm text-gray-500 dark:text-gray-400">You've reached the end!</p>}
            </div>
        </>
      )}
    </div>
  );
};

export default ManageVideos; 