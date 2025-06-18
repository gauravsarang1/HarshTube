import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { AnimatePresence } from 'framer-motion';
import UploadedVideos from '../video/UploadedVideos';
import UserPlaylists from '../playlist/UserPlaylists';
import LikedVideos from '../video/LikedVideos';
import WatchHistory from '../video/WatchHistory';

// Components
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import UserNotFound from './components/UserNotFound';
import ProfileStats from './components/ProfileStats';
import ProfileTabs from './components/ProfileTabs';
import TabContent from './components/TabContent';
import ActionButtons from './components/ActionButtons';
import CoverImage from './components/CoverImage';
import Avatar from './components/Avatar';
import FullNameEditor from './components/FullNameEditor';

// Utils
import { getAuthToken, handleAuthError } from './utils/auth';
import { userApi } from './utils/api';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [iseditCoverImage, setisEditCoverImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
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
        const token = getAuthToken();
        if (!handleAuthError(navigate)) return;
        
        const userData = await userApi.getProfile(username, token);
        setUser(userData.data);
        setFullName(userData.data.fullName);
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const editFullName = async () => {
    try {
      setIsFullNameLoading(true);
      const token = getAuthToken();
      if (!handleAuthError(navigate)) return;

      if (fullName?.trim() === '') {
        setError('Full name cannot be empty');
        setIsFullNameLoading(false);
        return;
      }

      const response = await userApi.updateFullName(fullName, token);
      
      if (response.statusCode === 201) {
        setFullNameDisabled(true);
        window.location.reload();
        setError('');
      }
    } catch (error) {
      setError(error.message || 'Failed to edit full name');
    } finally {
      setFullNameDisabled(true);
      setIsFullNameLoading(false);
    }
  };

  const editCoverImage = async () => {
    try {
      setIsEditing(true);
      const token = getAuthToken();
      if (!handleAuthError(navigate)) return;

      if (!coverImage) {
        alert('Please select a cover image');
        setisEditCoverImage(false);
        setIsEditing(false);
        return;
      }

      const response = await userApi.updateCoverImage(coverImage, token);
   
      if (response.statusCode === 200) {
        setisEditCoverImage(false);
        window.location.reload();
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to edit cover image');
    } finally {
      setisEditCoverImage(false);
      setIsEditing(false);
    }
  };

  const editAvatar = async () => {
    try {
      setIsAvatarLoading(true);
      const token = getAuthToken();
      if (!handleAuthError(navigate)) return;

      if (!avatar) {
        alert('Please select an avatar');
        setIsEditAvatar(false);
        setIsAvatarLoading(false);
        return;
      }

      const response = await userApi.updateAvatar(avatar, token);

      if (response.statusCode === 200) {
        setIsEditAvatar(false);
        window.location.reload();
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to edit avatar');
    } finally {
      setIsEditAvatar(false);
      setIsAvatarLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!user) return <UserNotFound />;

  const isOwnProfile = currentUser?.username === username;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <CoverImage 
        user={user} 
        isOwnProfile={isOwnProfile} 
        isEditing={isEditing} 
        setisEditCoverImage={setisEditCoverImage} 
        iseditCoverImage={iseditCoverImage} 
        setCoverImage={setCoverImage} 
        editCoverImage={editCoverImage} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar 
              user={user} 
              isOwnProfile={isOwnProfile} 
              isEditAvatar={isEditAvatar} 
              setIsEditAvatar={setIsEditAvatar} 
              setAvatar={setAvatar} 
              editAvatar={editAvatar} 
              isAvatarLoading={isAvatarLoading} 
            />

            <div className="flex-1 text-center md:text-left">
              <FullNameEditor 
                fullName={fullName} 
                setFullName={setFullName} 
                fullnameDisabled={fullnameDisabled} 
                setFullNameDisabled={setFullNameDisabled} 
                editFullName={editFullName} 
                isFullNameLoading={isFullNameLoading} 
                isOwnProfile={isOwnProfile}
              />
              <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
              
              <ProfileStats user={user} />

              <ActionButtons isOwnProfile={isOwnProfile} handleLogout={handleLogout} />
            </div>
          </div>

          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isOwnProfile={isOwnProfile} />
        </motion.div>
      </div>
      
      <TabContent activeTab={activeTab} />
    </motion.div>
  );
};

export default Profile; 