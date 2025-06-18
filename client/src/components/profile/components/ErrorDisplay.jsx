import React from 'react';

const ErrorDisplay = ({ error }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-red-500">{error}</div>
  </div>
);

export default ErrorDisplay; 