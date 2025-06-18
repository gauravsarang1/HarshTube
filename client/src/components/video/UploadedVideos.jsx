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
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setIsOwnProfile(user.username === username);
  }, [username]);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className='flex flex-wrap items-center gap-3 md:gap-5'>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            My Uploaded Videos
          </h1>
          <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
            {Array.isArray(videos) ? videos.length : 0} videos
          </span>
        </div>
        {isOwnProfile && (
           <Link
           to={`/upload`}
           className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-2.5 bg-gray-800 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-900 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
         >
           <Upload size={20} className="sm:size-5" />
           <span className="text-sm sm:text-base font-medium">Upload</span>
         </Link>
        )}
       
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