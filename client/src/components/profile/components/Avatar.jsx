import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, X } from 'lucide-react';

const Avatar = ({ user, isOwnProfile, isEditAvatar, setIsEditAvatar, setAvatar, editAvatar, isAvatarLoading }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="relative group"
  >
    <img
      src={user.avatar}
      alt={user.username}
      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg transition-all duration-300 group-hover:shadow-xl"
    />
    {isOwnProfile ? (
      <>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300 ${isEditAvatar ? 'hidden' : 'block'}`}
          onClick={() => {setIsEditAvatar(true)}}
        >
          <Camera size={20} />
        </motion.button>
        <div className='absolute bottom-[-50px] right-0 flex items-center gap-2'>
          <motion.input
            onChange={(e) => {setAvatar(e.target.files[0])}}
            type="file"
            className={`max-w-40 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isEditAvatar ? 'block' : 'hidden'}`}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isEditAvatar && !isAvatarLoading ? 'block' : 'hidden'}`}
            onClick={() => {editAvatar()}}
          >
            <Check size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isEditAvatar && !isAvatarLoading ? 'block' : 'hidden'}`}
            onClick={() => {setIsEditAvatar(false)}}
          >
            <X size={20} />
          </motion.button>
          <motion.button
            className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isAvatarLoading ? 'block' : 'hidden'}`}
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