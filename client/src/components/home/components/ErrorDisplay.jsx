const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80 flex items-center justify-center">
      <div className="max-w-md w-full bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm text-center">
        <p className="text-red-500 dark:text-red-400 font-semibold text-lg">{error}</p>
        <button
          onClick={onRetry}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay; 