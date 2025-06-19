import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, X } from 'lucide-react';

const Avatar = ({ user, isOwnProfile, isEditAvatar, setIsEditAvatar, setAvatar, editAvatar, isAvatarLoading }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="relative group"
  >
    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-1 shadow-xl flex items-center justify-center">
      <img
        src={user.avatar}
        alt={user.username}
        className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg transition-all duration-300 group-hover:shadow-2xl object-cover"
      />
    </div>
    {isOwnProfile ? (
      <>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-800 ${isEditAvatar ? 'hidden' : 'block'}`}
          onClick={() => {setIsEditAvatar(true)}}
        >
          <Camera size={20} />
        </motion.button>
        <div className='absolute bottom-[-54px] right-0 flex items-center gap-2'>
          <motion.input
            onChange={(e) => {setAvatar(e.target.files[0])}}
            type="file"
            className={`max-w-40 bg-gradient-to-br from-white/80 to-gray-200/80 dark:from-gray-800/80 dark:to-gray-900/80 text-gray-900 dark:text-white p-2 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow transition-all duration-300 ${isEditAvatar ? 'block' : 'hidden'}`}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-md hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-800 ${isEditAvatar && !isAvatarLoading ? 'block' : 'hidden'}`}
            onClick={() => {editAvatar()}}
          >
            <Check size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 rounded-full shadow-md hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-800 ${isEditAvatar && !isAvatarLoading ? 'block' : 'hidden'}`}
            onClick={() => {setIsEditAvatar(false)}}
          >
            <X size={20} />
          </motion.button>
          <motion.button
            className={`bg-gradient-to-r from-blue-400 to-purple-600 text-white p-3 rounded-full shadow-md border-2 border-white dark:border-gray-800 ${isAvatarLoading ? 'block' : 'hidden'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </motion.button>
        </div>
      </>
    ) : (
      <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</span>
      </div>
    )}
  </motion.div>
);

export default Avatar; 