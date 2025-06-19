import React from 'react';
import { Link } from 'react-router-dom';

const ResultUsers = ({ users = [] }) => {
  if (!users.length) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">No users found.</div>;
  }
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
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
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{user.fullName || user.username}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">@{user.username}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResultUsers; 