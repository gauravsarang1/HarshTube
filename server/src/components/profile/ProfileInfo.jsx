import { motion } from 'framer-motion';
import { Users, UserPlus, Video, Edit, Check } from 'lucide-react';
import { Input } from '../ui/input';

const ProfileInfo = ({ 
  user, 
  isOwnProfile, 
  fullName, 
  setFullName, 
  fullnameDisabled, 
  setFullNameDisabled, 
  isFullNameLoading, 
  editFullName 
}) => {
  return (
    <div className="flex-1 text-center md:text-left">
      <div className="flex items-center justify-center md:justify-start gap-2">
        <Input 
          disabled={fullnameDisabled}
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)}
          className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent outline-none border-none focus:ring-0 p-0" 
        />
        {isOwnProfile && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${fullnameDisabled && !isFullNameLoading ? 'block' : 'hidden'}`}
              onClick={() => setFullNameDisabled(!fullnameDisabled)}
            >
              <Edit size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${fullnameDisabled && !isFullNameLoading ? 'hidden' : 'block'}`}
              onClick={editFullName}
            >
              <Check size={18} />
            </motion.button>
            <motion.button
              className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isFullNameLoading ? 'block' : 'hidden'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </motion.button>
          </>
        )}
      </div>
      <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
      
      <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
        >
          <Users size={20} />
          <span>{user.subscribersCount} subscribers</span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
        >
          <UserPlus size={20} />
          <span>{user.channelSubscribedToCount} subscribed</span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
        >
          <Video size={20} />
          <span>{user.totalVideos} videos</span>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileInfo; 