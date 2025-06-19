import React from 'react';

const UserNotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center">
    <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl px-8 py-6 text-center border-2 border-blue-300 dark:border-blue-700">
      <div className="text-2xl font-semibold text-gray-700 dark:text-gray-200 drop-shadow mb-2">User Not Found</div>
      <div className="text-gray-500 dark:text-gray-400 text-lg">The user you are looking for does not exist.</div>
    </div>
  </div>
);

export default UserNotFound; 