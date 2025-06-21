import React from 'react';
import { motion } from 'framer-motion';
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo, 
  showLoading, 
  dismissToast, 
  dismissAllToasts,
  showCustomToast,
  showPromiseToast 
} from '../../utils/toast';

const ToastDemo = () => {
  const handlePromiseToast = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve('Operation completed successfully!');
        } else {
          reject(new Error('Operation failed!'));
        }
      }, 2000);
    });

    showPromiseToast(promise, {
      loading: 'Processing your request...',
      success: 'Great! Everything worked!',
      error: 'Oops! Something went wrong.'
    });
  };

  const handleLoadingToast = () => {
    const loadingToast = showLoading('Uploading video...');
    
    // Simulate upload completion
    setTimeout(() => {
      dismissToast(loadingToast);
      showSuccess('Video uploaded successfully!');
    }, 3000);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Toast Notification System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Click the buttons below to see different types of toast notifications in action.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Success Toast */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showSuccess('Operation completed successfully!')}
              className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Success Toast
            </motion.button>

            {/* Error Toast */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showError('Something went wrong!')}
              className="p-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Error Toast
            </motion.button>

            {/* Warning Toast */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showWarning('Please check your input!')}
              className="p-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Warning Toast
            </motion.button>

            {/* Info Toast */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showInfo('Here is some information for you!')}
              className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Info Toast
            </motion.button>

            {/* Loading Toast */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadingToast}
              className="p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Loading Toast
            </motion.button>

            {/* Custom Toast */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showCustomToast('Custom styled toast!', '🎉', {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: '2px solid #667eea'
              })}
              className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Custom Toast
            </motion.button>

            {/* Promise Toast */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePromiseToast}
              className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Promise Toast
            </motion.button>

            {/* Dismiss All */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={dismissAllToasts}
              className="p-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Dismiss All
            </motion.button>
          </div>

          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Usage Examples
            </h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Success:</strong> <code>showSuccess('Operation completed!')</code></p>
              <p><strong>Error:</strong> <code>showError('Something went wrong!')</code></p>
              <p><strong>Warning:</strong> <code>showWarning('Please check your input!')</code></p>
              <p><strong>Info:</strong> <code>showInfo('Here is some information!')</code></p>
              <p><strong>Loading:</strong> <code>const toast = showLoading('Loading...'); dismissToast(toast);</code></p>
              <p><strong>Custom:</strong> <code>showCustomToast('Message', '🎉', customStyle)</code></p>
              <p><strong>Promise:</strong> <code>showPromiseToast(promise, messages)</code></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ToastDemo; 