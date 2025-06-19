import React from 'react';

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl px-10 py-8 border-2 border-blue-300 dark:border-blue-800">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 dark:border-pink-500 shadow-lg"></div>
      <p className="text-lg text-gray-700 dark:text-gray-300 animate-pulse font-semibold">Loading profile...</p>
    </div>
  </div>
);

export default LoadingSpinner; 