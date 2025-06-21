import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, X, Info } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const UploadVideo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState({
    video: null,
    thumbnail: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const extractVideoMetadata = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        // Get video title from filename (remove extension)
        const title = file.name.replace(/\.[^/.]+$/, "");
        
        // Create a default description
        const description = `Uploaded video: ${title}`;

        // Try to extract thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailUrl = URL.createObjectURL(blob);
            resolve({
              title,
              description,
              thumbnailUrl,
              thumbnailBlob: blob
            });
          } else {
            resolve({
              title,
              description
            });
          }
        }, 'image/jpeg', 0.7);

        // Seek to 1 second to get a better thumbnail
        video.currentTime = 1;
      };

      video.onerror = () => {
        // If metadata extraction fails, use filename as title
        const title = file.name.replace(/\.[^/.]+$/, "");
        resolve({
          title,
          description: `Uploaded video: ${title}`
        });
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setPreview((prev) => ({ ...prev, video: videoUrl }));

      // Extract metadata and set form data
      const metadata = await extractVideoMetadata(file);
      if (metadata) {
        setFormData(prev => ({
          ...prev,
          title: metadata.title,
          description: metadata.description
        }));

        // If thumbnail was extracted, set it
        if (metadata.thumbnailUrl) {
          setPreview(prev => ({ ...prev, thumbnail: metadata.thumbnailUrl }));
          setThumbnailFile(metadata.thumbnailBlob);
        }
      }
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const thumbnailUrl = URL.createObjectURL(file);
      setPreview((prev) => ({ ...prev, thumbnail: thumbnailUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showError('Please login to upload videos');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('filePath', videoFile);
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      const response = await axios.post(
        `${API_BASE_URL}/videos/upload-Video`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        showSuccess('Video uploaded successfully');
        navigate('/home');
      } else {
        showError(response.data.message);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (type) => {
    if (type === 'video') {
      setVideoFile(null);
      setPreview((prev) => ({ ...prev, video: null }));
      // Clear form data when video is removed
      setFormData({
        title: '',
        description: '',
      });
      // Clear thumbnail if it was auto-generated
      if (thumbnailFile) {
        setThumbnailFile(null);
        setPreview((prev) => ({ ...prev, thumbnail: null }));
      }
    } else {
      setThumbnailFile(null);
      setPreview((prev) => ({ ...prev, thumbnail: null }));
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-10 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
            Upload Video
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
                placeholder="Enter video title"
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
                placeholder="Enter video description"
              />
            </div>
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Info size={16} />
                Video File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl bg-gradient-to-br from-blue-50/30 to-purple-50/10 dark:from-gray-800/30 dark:to-gray-900/10 transition-all duration-300">
                {preview.video ? (
                  <div className="relative">
                    <video
                      src={preview.video}
                      className="max-h-64 rounded-xl shadow-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('video')}
                      className="absolute top-2 right-2 p-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:scale-110 shadow-md transition-all duration-300"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-blue-400 dark:text-blue-500" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label
                        htmlFor="video-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400"
                      >
                        <span>Upload a video</span>
                        <input
                          id="video-upload"
                          name="video-upload"
                          type="file"
                          accept="video/*"
                          className="sr-only"
                          onChange={handleVideoChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      MP4, WebM, or MOV up to 100MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Thumbnail (Optional)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl bg-gradient-to-br from-purple-50/30 to-blue-50/10 dark:from-gray-800/30 dark:to-gray-900/10 transition-all duration-300">
                {preview.thumbnail ? (
                  <div className="relative">
                    <img
                      src={preview.thumbnail}
                      alt="Thumbnail preview"
                      className="max-h-32 rounded-xl shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('thumbnail')}
                      className="absolute top-2 right-2 p-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:scale-110 shadow-md transition-all duration-300"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-purple-400 dark:text-purple-500" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label
                        htmlFor="thumbnail-upload"
                        className="relative cursor-pointer rounded-md font-medium text-purple-500 hover:text-purple-400"
                      >
                        <span>Upload a thumbnail</span>
                        <input
                          id="thumbnail-upload"
                          name="thumbnail-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleThumbnailChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, or JPEG up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2 border border-red-200 dark:border-red-700 shadow-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !videoFile}
              className={`w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg
                ${loading || !videoFile
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 hover:shadow-xl'}
              `}
            >
              {loading ? (
                <>
                  <Upload className="animate-spin w-5 h-5" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" /> Upload Video
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo; 