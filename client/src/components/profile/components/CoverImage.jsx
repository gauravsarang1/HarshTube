import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, X } from 'lucide-react';

const CoverImage = ({ user, isOwnProfile, isEditing, setisEditCoverImage, iseditCoverImage, setCoverImage, editCoverImage }) => (
  <div className="relative h-48 md:h-64 lg:h-80 bg-gray-200 dark:bg-gray-800 overflow-hidden group">
    {user.coverImage ? (
      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        src={user.coverImage}
        alt="Cover"
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-gradient"></div>
    )}
    {isOwnProfile && (
      <div className='absolute top-10 right-4 flex items-center gap-2'>
        {!isEditing ? (
          <>
            <motion.button
              onClick={() => {setisEditCoverImage(true)}}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${iseditCoverImage ? 'hidden' : 'block'}`}
            >
              <Camera size={20} />
            </motion.button>
            <motion.input
              onChange={(e) => {setCoverImage(e.target.files[0])}}
              type="file"
              className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${iseditCoverImage ? 'block' : 'hidden'}`}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${iseditCoverImage ? 'block' : 'hidden'}`}
              onClick={() => {setisEditCoverImage(false)}}
            >
              <X size={20} />
            </motion.button>
            <motion.button
              onClick={() => {editCoverImage()}}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${iseditCoverImage ? 'block' : 'hidden'}`}
            >
              <Check size={20} />
            </motion.button>
          </>
        ) : (
          <motion.button className='bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </motion.button>
        )}
      </div>
    )}
  </div>
);

export default CoverImage; 