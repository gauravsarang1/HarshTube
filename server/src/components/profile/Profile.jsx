import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Video, 
  Users, 
  UserPlus, 
  ThumbsUp, 
  Eye, 
  Calendar,
  Clock,
  MoreVertical,
  Share2,
  Bell,
  MessageCircle,
  LogOut,
  Settings,
  Camera,
  Edit,
  Check,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadedVideos from '../video/UploadedVideos';
import UserPlaylists from '../playlist/UserPlaylists';
import LikedVideos from '../video/LikedVideos';
import WatchHistory from '../video/WatchHistory';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('videos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [iseditCoverImage, setisEditCoverImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [fullnameDisabled, setFullNameDisabled] = useState(true);
  const [isFullNameLoading, setIsFullNameLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isEditAvatar, setIsEditAvatar] = useState(false);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if(!token) {
          navigate('/login');
          return;
        }
        
        // Fetch user profile
        const profileResponse = await axios.get(`http://localhost:5050/api/v1/users/c/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = profileResponse?.data?.data;
        setUser(userData);
        setFullName(userData.fullName);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    /*const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5050/api/v1/videos/user/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load videos');
      }
    };
    fetchVideos();*/  

    fetchUserData();
  }, [username]);

  const editFullName = async () => {
    try {
      setIsFullNameLoading(true);
      const token = localStorage.getItem('token');
      if(!token) {
        navigate('/login');
        return;
      }

      if(fullName?.trim() === '') {
        setError('Full name cannot be empty');
        setIsFullNameLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('fullName', fullName?.trim());

      const response = await axios.post('http://localhost:5050/api/v1/users/update-all-details', 
      formData,
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(response.data);
      if(response.data.statusCode === 201) {
        setFullNameDisabled(true);
        window.location.reload();
        setError('');
      }
      setFullNameDisabled(true);
      setIsFullNameLoading(false);
    } catch (error) {
      setError(error?.message || 'Failed to edit full name');
      setFullNameDisabled(true);
      setIsFullNameLoading(false);
    }
  }

  const editCoverImage = async () => {
    try {
      
      setIsEditing(true);
      const token = localStorage.getItem('token');
      if(!token) {
        navigate('/login');
        return;
      }

      if(!coverImage) {
        alert('Please select a cover image');
        setisEditCoverImage(false);
        setIsEditing(false);
        return;
      }
      const formData = new FormData();
      formData.append('coverImage', coverImage);
      
      const response = await axios.post('http://localhost:5050/api/v1/users/update-coverImage', 
      formData,
      {
        'Content-Type': 'multipart/form-data',
        headers: { Authorization: `Bearer ${token}` }
      });
   
      if(response.data.statusCode === 200) {
        setisEditCoverImage(false);
        window.location.reload();
        setError('');
      }
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || 'Failed to edit cover image');
      setisEditCoverImage(false);
      setIsEditing(false);
    }
  }

  const editAvatar = async () => {
    try {
      setIsAvatarLoading(true);
      const token = localStorage.getItem('token');
      if(!token) {
        navigate('/login');
        return;
      }

      if(!avatar) {
        alert('Please select an avatar');
        setIsEditAvatar(false);
        setIsAvatarLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('avatar', avatar);

      const response = await axios.post('http://localhost:5050/api/v1/users/update-avatar', 
      formData,
      {
        'Content-Type': 'multipart/form-data',
        headers: { Authorization: `Bearer ${token}` }
      });

      if(response.data.statusCode === 200) {
        setIsEditAvatar(false);
        window.location.reload();
        setError('');
      }
      setIsAvatarLoading(false);
    } catch (err) {
      setError(err?.message || 'Failed to edit avatar');
      setIsEditAvatar(false);
      setIsAvatarLoading(false);
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500">User not found</div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isOwnProfile = currentUser?.username === username;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
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
             {!isEditing?(
                <>
                    <motion.button
                      onClick={() => {setisEditCoverImage(true)}}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={` bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${iseditCoverImage ? 'hidden' : 'block'}`}
                    >
                      <Camera size={20} />
                    </motion.button>
                    <motion.input
                      onChange={(e) => {setCoverImage(e.target.files[0])}}
                      type="file"
                      className={` bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${iseditCoverImage ? 'block' : 'hidden'}`}
                    >
                      
                    </motion.input>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={` bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${iseditCoverImage ? 'block' : 'hidden'}`}
                      onClick={() => {setisEditCoverImage(false)}}
                    >
                      <X size={20} />
                    </motion.button>
                    <motion.button
                      onClick={() => {editCoverImage()}}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={` bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${iseditCoverImage ? 'block' : 'hidden'}`}
                    >
                      <Check size={20} />
                    </motion.button>
                </>
             ):(
              <motion.button
                className=' bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin  lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </motion.button>
             )}
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar with Hover Effect */}
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
                      >
                        
                      </motion.input>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={` bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isEditAvatar && !isAvatarLoading ? 'block' : 'hidden'}`}
                        onClick={() => {editAvatar()}}
                      >
                        <Check size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={` bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isEditAvatar && !isAvatarLoading ? 'block' : 'hidden'}`}
                        onClick={() => {setIsEditAvatar(false)}}
                      >
                        <X size={20} />
                      </motion.button>
                      <motion.button
                        className={` bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isAvatarLoading ? 'block' : 'hidden'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin  lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      </motion.button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</span>
                </div>
              )}
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <input 
                  disabled={fullnameDisabled}
                  className="text-2xl font-bold text-gray-900 dark:text-white bg-transparent outline-none" value={fullName} onChange={(e) => {setFullName(e.target.value)}} />
                {isOwnProfile && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${fullnameDisabled && !isFullNameLoading ? 'block' : 'hidden'}`}
                      onClick={() => {setFullNameDisabled(!fullnameDisabled)}}
                    >
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${fullnameDisabled && !isFullNameLoading ? 'hidden' : 'block'}`}
                      onClick={() => {editFullName()}}
                    >
                      <Check size={18} />
                    </motion.button>
                    <motion.button
                      className={` bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isFullNameLoading ? 'block' : 'hidden'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin  lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
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

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3 justify-center md:justify-start">
                {isOwnProfile ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors duration-300"
                      onClick={handleLogout}
                    >
                      <LogOut size={20} />
                      Logout
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-full transition-colors duration-300"
                      onClick={() => {/* Handle settings */}}
                    >
                      <Settings size={20} />
                      Settings
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-colors duration-300"
                    >
                      <UserPlus size={20} />
                      Subscribe
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-full transition-colors duration-300"
                    >
                      <Bell size={20} />
                      Notifications
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-full transition-colors duration-300"
                    >
                      <Share2 size={20} />
                      Share
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs with Animation */}
          <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {['videos', 'playlists'].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                    activeTab === tab
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
              
              {/*personal Tabs*/}
              { isOwnProfile && ['liked videos', 'watch history'].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300 ${
                    activeTab === tab
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>
      
      {/* Content with Animation */}
      <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              {activeTab === 'videos' && (
                <UploadedVideos />
              )}

              {activeTab === 'playlists' && (
                <UserPlaylists />
              )}

              {activeTab === 'liked videos' && (
                <LikedVideos />
              )}

              {activeTab === 'watch history' && (
                <WatchHistory />
              )}

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
    </motion.div>
  );
};

export default Profile; 