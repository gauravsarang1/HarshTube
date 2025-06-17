import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock , Upload} from 'lucide-react';
import VideoGrid from './VideoGrid';

const UploadedVideos = () => {
  const { username } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  const fetchUploadedVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5050/api/v1/videos/all-uploaded-videos/${username}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const { videos: videoList, hasMore: more } = response.data.data;
      
      // Filter out any duplicate videos based on _id
      setVideos(prev => {
        const existingIds = new Set(prev.map(video => video._id));
        const newVideos = videoList.filter(video => !existingIds.has(video._id));
        return [...prev, ...newVideos];
      });
      
      setHasMore(more);
      setPage(page);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch uploaded videos. Please try again later.');
        console.error('Error fetching uploaded videos:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploadedVideos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000;

      if (scrollPosition >= threshold) {
        if (!loadingMore && hasMore) {
          fetchLikedVideos(page + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, page, fetchUploadedVideos]);

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

  return (
    <div className="min-h-screen pt-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-3">
        <div className='flex items-center gap-2 md:gap-4'>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Uploaded Videos</h1>
          <span className="text-md text-white bg-blue-500 px-2 py-1 rounded-lg">
            {Array.isArray(videos) ? videos.length : 0} videos
          </span>
        </div>
        <Link
            to={`/upload`}
            className="flex items-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Upload size={20} />
            Upload
          </Link>
      </div>
      
      <VideoGrid
        videos={videos}
        loading={loading}
        error={error}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onClick={() => fetchUploadedVideos(1)}
        emptyMessage="No videos uploaded yet. Start sharing your videos!"
      />
    </div>
  );
};

export default UploadedVideos; 