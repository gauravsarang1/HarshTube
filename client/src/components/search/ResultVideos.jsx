import React from 'react';
import { Link } from 'react-router-dom';

const ResultVideos = ({ videos = [] }) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!videos.length) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">No videos found.</div>;
  }
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
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
        ))}
      </div>
    </div>
  );
};

export default ResultVideos; 