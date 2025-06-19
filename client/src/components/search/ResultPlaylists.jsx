import React from 'react';
import { Link } from 'react-router-dom';

const ResultPlaylists = ({ playlists = [] }) => {
  if (!playlists.length) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">No playlists found.</div>;
  }
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map(playlist => (
          <Link
          key={playlist._id}
          to={`/playlist/${playlist._id}`}
          className="group relative flex flex-col bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-800/50 overflow-hidden min-h-[340px] backdrop-blur-sm hover:-translate-y-1"
        >
          {/* Thumbnail Section with Enhanced Overlay */}
          <div className="relative w-full h-44 overflow-hidden">
            <img
              src={playlist.PlaylistThumbnail || '/default-playlist.png'}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            
            {/* Multi-layered gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 group-hover:from-blue-500/20 group-hover:to-purple-600/20 transition-all duration-500" />
            
            {/* Floating video count badge */}
            <div className="absolute top-3 right-3 backdrop-blur-md bg-white/20 dark:bg-black/30 border border-white/30 dark:border-white/20 rounded-xl px-3 py-1.5">
              <span className="text-white text-xs font-bold tracking-wide">
                {playlist.videosCount || (playlist.videos ? playlist.videos.length : 0)} videos
              </span>
            </div>
        
            {/* Play icon overlay on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/90 dark:bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
                <svg className="w-7 h-7 text-gray-900 dark:text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        
          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between p-5">
            {/* Title */}
            <div className="mb-4">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {playlist.name}
              </h3>
            </div>
        
            {/* Owner Info with enhanced styling */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img
                  src={playlist.owner?.avatar || '/default-avatar.png'}
                  alt={playlist.owner?.fullName || playlist.owner?.username || 'User'}
                  className="w-10 h-10 rounded-full object-cover border-3 border-white dark:border-gray-700 shadow-lg ring-2 ring-gray-100 dark:ring-gray-800"
                />
                {/* Online indicator (optional) */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm leading-tight">
                  {playlist.owner?.fullName || playlist.owner?.username}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">Creator</span>
              </div>
            </div>
        
            {/* Bottom section with enhanced styling */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="font-medium">Updated recently</span>
                </div>
              </div>
        
              {/* Action button */}
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 group-hover:scale-110">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        
          {/* Subtle animated border on hover */}
          <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-colors duration-500 pointer-events-none"></div>
        </Link>
        ))}
      </div>
    </div>
  );
};

export default ResultPlaylists; 