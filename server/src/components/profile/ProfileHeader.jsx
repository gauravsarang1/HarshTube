import { motion } from 'framer-motion';
import { Camera, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const ProfileHeader = ({ 
  user, 
  isOwnProfile, 
  coverImage, 
  setCoverImage, 
  isEditing, 
  setIsEditing, 
  editCoverImage, 
  avatar, 
  setAvatar, 
  isEditAvatar, 
  setIsEditAvatar, 
  isAvatarLoading, 
  editAvatar 
}) => {
  return (
    <>
      {/* Cover Image with Parallax Effect */}
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
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300"
                >
                  <Camera size={20} />
                </motion.button>
                <motion.input
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  type="file"
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300"
                  onClick={() => setIsEditing(false)}
                >
                  <X size={20} />
                </motion.button>
                <motion.button
                  onClick={editCoverImage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300"
                >
                  <Check size={20} />
                </motion.button>
              </>
            ) : (
              <motion.button className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Avatar Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300 ${isEditAvatar ? 'hidden' : 'block'}`}
                    onClick={() => setIsEditAvatar(true)}
                  >
                    <Camera size={20} />
                  </motion.button>
                  <div className='absolute bottom-[-50px] right-0 flex items-center gap-2'>
                    <motion.input
                      onChange={(e) => setAvatar(e.target.files[0])}
                      type="file"
                      className={`max-w-40 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isEditAvatar ? 'block' : 'hidden'}`}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isEditAvatar && !isAvatarLoading ? 'block' : 'hidden'}`}
                      onClick={editAvatar}
                    >
                      <Check size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isEditAvatar && !isAvatarLoading ? 'block' : 'hidden'}`}
                      onClick={() => setIsEditAvatar(false)}
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
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProfileHeader; 