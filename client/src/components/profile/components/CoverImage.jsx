import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, X } from 'lucide-react';

const CoverImage = ({ user, isOwnProfile, isEditing, setisEditCoverImage, iseditCoverImage, setCoverImage, editCoverImage }) => (
  <div className="relative h-32 sm:h-40 md:h-64 lg:h-80 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 overflow-hidden group rounded-b-xl lg:rounded-b-2xl shadow-xl border-b-4 border-blue-400 dark:border-blue-900">
    {user.coverImage ? (
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        src={user.coverImage}
        alt="Cover"
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 rounded-b-xl lg:rounded-b-2xl"
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 animate-gradient rounded-b-xl lg:rounded-b-2xl"></div>
    )}
    {isOwnProfile && (
      <div className='absolute top-4 right-2 md:top-10 md:right-4 flex items-center gap-1 md:gap-2 z-10'>
        {!isEditing ? (
          <>
            <motion.button
              onClick={() => {setisEditCoverImage(true)}}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 md:p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-800 ${iseditCoverImage ? 'hidden' : 'block'}`}
            >
              <Camera size={16} className="md:w-5 md:h-5" />
            </motion.button>
            <motion.input
              onChange={(e) => {setCoverImage(e.target.files[0])}}
              type="file"
              className={`bg-gradient-to-br from-white/80 to-gray-200/80 dark:from-gray-800/80 dark:to-gray-900/80 text-gray-900 dark:text-white p-1.5 md:p-2 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow transition-all duration-300 text-xs md:text-sm ${iseditCoverImage ? 'block' : 'hidden'}`}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`bg-gradient-to-r from-red-500 to-pink-600 text-white p-2 md:p-3 rounded-full shadow-md hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-800 ${iseditCoverImage ? 'block' : 'hidden'}`}
              onClick={() => {setisEditCoverImage(false)}}
            >
              <X size={16} className="md:w-5 md:h-5" />
            </motion.button>
            <motion.button
              onClick={() => {editCoverImage()}}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 md:p-3 rounded-full shadow-md hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-800 ${iseditCoverImage ? 'block' : 'hidden'}`}
            >
              <Check size={16} className="md:w-5 md:h-5" />
            </motion.button>
          </>
        ) : (
          <motion.button className='bg-gradient-to-r from-blue-400 to-purple-600 text-white p-2 md:p-3 rounded-full shadow-md border-2 border-white dark:border-gray-800'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin lucide-loader-circle-icon lucide-loader-circle md:w-6 md:h-6"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </motion.button>
        )}
      </div>
    )}
  </div>
);

export default CoverImage; 