import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/playlist/create`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.statusCode === 201) {
        //navigate(`/playlist/${response.data.data._id}`);
        navigate(-1);
      }
      console.log(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-10 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          Create New Playlist
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Playlist Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="Enter playlist name"
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
              placeholder="Enter playlist description"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2 border border-red-200 dark:border-red-700 shadow-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl font-semibold shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg
                ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 hover:shadow-xl'}
              `}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                'Create Playlist'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylist; 