import React from 'react';

const ErrorDisplay = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-500 dark:from-red-900 dark:via-pink-900 dark:to-purple-900 flex items-center justify-center">
    <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl px-8 py-6 text-center border-2 border-red-300 dark:border-red-700">
      <div className="text-2xl font-semibold text-red-600 dark:text-red-400 drop-shadow mb-2">Error</div>
      <div className="text-red-500 dark:text-red-300 text-lg">{error}</div>
    </div>
  </div>
);

export default ErrorDisplay; 