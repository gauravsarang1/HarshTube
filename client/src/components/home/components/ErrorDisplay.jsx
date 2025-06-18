const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay; 