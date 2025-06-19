import React from 'react';
import { Link } from 'react-router-dom';

const ResultUsers = ({ users = [] }) => {
  if (!users.length) {
    return (
      <div className="flex justify-center items-center min-h-[20vh]">
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 py-8 border-2 border-blue-200 dark:border-blue-800 text-center">
          <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">No users found.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-8 mt-10">
      <h2 className="text-xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow">Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map(user => (
          <Link
            key={user._id}
            to={`/profile/${user.username}`}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.fullName || user.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-1 items-center justify-between w-full">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">{user.fullName || user.username}</div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">@{user.username}</div>
              </div>
              <button
                className="text-xs font-semibold px-3 py-1 rounded-full bg-green-500 text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 ml-4"
                type="button"
                tabIndex={-1}
                disabled
              >
                {typeof user.subscribersCount === 'number' ? user.subscribersCount : 0} subscribers
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResultUsers; 