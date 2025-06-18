import { motion, AnimatePresence } from 'framer-motion';
import UploadedVideos from '../video/UploadedVideos';
import UserPlaylists from '../playlist/UserPlaylists';
import LikedVideos from '../video/LikedVideos';
import WatchHistory from '../video/WatchHistory';
import { UserPlus } from 'lucide-react';

const ProfileContent = ({ activeTab, subscribers, subscriptions }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-4"
      >
        {activeTab === 'videos' && <UploadedVideos />}
        {activeTab === 'playlists' && <UserPlaylists />}
        {activeTab === 'liked videos' && <LikedVideos />}
        {activeTab === 'watch history' && <WatchHistory />}
        {activeTab === 'subscribers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscribers.map((subscriber) => (
              <div key={subscriber._id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
                <img
                  src={subscriber.avatar}
                  alt={subscriber.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{subscriber.fullName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{subscriber.username}</p>
                </div>
                <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                  <UserPlus size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'subscriptions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <div key={subscription._id} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
                <img
                  src={subscription.avatar}
                  alt={subscription.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{subscription.fullName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{subscription.username}</p>
                </div>
                <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                  <UserPlus size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileContent; 