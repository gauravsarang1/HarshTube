import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Loader2 } from 'lucide-react';

const VideoGrid = ({ 
  videos, 
  loading, 
  error, 
  loadingMore, 
  hasMore,
  onClick,
  emptyMessage = "No videos found."
}) => {
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
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
        <button
          onClick={onClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {Array.isArray(videos) && videos.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.isArray(videos) && videos.map((video) => {
            const isNew = (() => {
              if (!video.createdAt) return false;
              const created = new Date(video.createdAt).getTime();
              const now = Date.now();
              return (now - created) < 24 * 60 * 60 * 1000;
            })();
            return (
              <Link
                key={video._id}
                to={`/watch/${video._id}`}
                className="group"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  {isNew && (
                    <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      New
                    </div>
                  )}
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
                  <div className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">{video.title}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    {video.owner?.avatar && (
                      <img
                        src={video.owner.avatar}
                        alt={video.owner.fullName}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span>{video.owner?.fullName || 'Unknown User'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}
      {/* No More Videos Message */}
      {!hasMore && Array.isArray(videos) && videos.length > 0 && !loading && (
        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
          No more videos to load
        </div>
      )}
    </div>
  );
};

export default VideoGrid; 