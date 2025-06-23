import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, Loader2, Music, Plus, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError } from '../../utils/toast';

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/playlist/create', formData);

      if (response.data.statusCode === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate(-1);
          showSuccess('Playlist created successfully');
        }, 1500);
      }
      console.log(response.data);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim().length > 0 && formData.description.trim().length > 0;

  return (
    <div className="min-h-screen pt-8 md:pt-10 px-3 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 mb-6 transition-all duration-300"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Playlists</span>
        </motion.button>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg"
            >
              <Music size={24} className="md:w-8 md:h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-2">
              Create New Playlist
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Organize your favorite videos into a beautiful playlist
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
                  <p className="text-green-800 dark:text-green-200 font-semibold">Playlist Created Successfully!</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">Redirecting you back...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Playlist Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter a catchy playlist name"
                />
                <Music size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500">
                  {formData.name.length}/100
                </div>
              </div>
            </motion.div>

            {/* Description Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Description *
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  maxLength={500}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-500 resize-none placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Describe what this playlist is about..."
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                  {formData.description.length}/500
                </div>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-700 flex items-center gap-3"
                >
                  <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg relative overflow-hidden group
                  ${loading || !isFormValid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:shadow-xl hover:scale-105'
                  }
                `}
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                      <span>Create Playlist</span>
                    </>
                  )}
                </div>
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </motion.div>
          </form>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
          >
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">Pro Tips</h4>
                <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Use descriptive names to make your playlist easy to find</li>
                  <li>• Add a detailed description to help others understand the content</li>
                  <li>• You can always edit your playlist later</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePlaylist; 