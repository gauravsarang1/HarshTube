import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, X, Info } from 'lucide-react';

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
        throw new Error('Please login to upload videos');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('filePath', videoFile);
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      const response = await axios.post(
        'http://localhost:5050/api/v1/videos/upload-Video',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload video');
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
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter video title"
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter video description"
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Info size={16} />
              Video File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
              {preview.video ? (
                <div className="relative">
                  <video
                    src={preview.video}
                    className="max-h-64 rounded-lg"
                    controls
                  />
                  <button
                    type="button"
                    onClick={() => removeFile('video')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
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
            <label className="block text-sm font-medium mb-2">Thumbnail (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
              {preview.thumbnail ? (
                <div className="relative">
                  <img
                    src={preview.thumbnail}
                    alt="Thumbnail preview"
                    className="max-h-32 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile('thumbnail')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="thumbnail-upload"
                      className="relative cursor-pointer rounded-md font-medium text-blue-500 hover:text-blue-400"
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
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !videoFile}
            className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
              loading || !videoFile
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo; 