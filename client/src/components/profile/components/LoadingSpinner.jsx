import React from 'react';

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading profile...</p>
    </div>
  </div>
);

export default LoadingSpinner; 