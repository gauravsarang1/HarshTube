import React from 'react';
import { Link } from 'react-router-dom';

const ResultVideos = ({ videos = [] }) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!videos.length) {
    return (
      <div className="flex justify-center items-center min-h-[20vh]">
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 py-8 border-2 border-blue-200 dark:border-blue-800 text-center">
          <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">No videos found.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-8">
      <h2 className="text-xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow">Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map(video => (
          <Link
            key={video._id}
            to={`/watch/${video._id}`}
            className="group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
                {formatDuration(video.duration)}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-14 h-14 bg-white/90 dark:bg-black/80 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-7 h-7 text-blue-600 dark:text-blue-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="font-semibold line-clamp-2 mb-1 transition-colors duration-200 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {video.title}
              </div>
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
        ))}
      </div>
    </div>
  );
};

export default ResultVideos; 