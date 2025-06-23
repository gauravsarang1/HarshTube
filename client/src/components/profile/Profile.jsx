import { useState, useEffect, useCallback } from 'react';
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
import { showSuccess, showError } from '../../utils/toast';

// Hooks
import { useUserProfile } from '../../hooks/useUserProfile';

// Utils
import { userApi } from './utils/api';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, isLoading, error, fullName, setFullName } = useUserProfile(username);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');
  
  // State for editing UI
  const [coverImage, setCoverImage] = useState(null);
  const [iseditCoverImage, setisEditCoverImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fullnameDisabled, setFullNameDisabled] = useState(true);
  const [isFullNameLoading, setIsFullNameLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isEditAvatar, setIsEditAvatar] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrentUser(storedUser);

    const isAuthenticated = !!localStorage.getItem('token');
    if (!isAuthenticated && activeTab !== 'videos' && activeTab !== 'playlists') {
      setActiveTab('videos');
    }
  }, [activeTab]);

  const editFullName = useCallback(async () => {
    try {
      setIsFullNameLoading(true);
      if (fullName?.trim() === '') {
        showError('Full name cannot be empty');
        return;
      }
      const response = await userApi.updateFullName(fullName);
      if (response.statusCode === 201) {
        setFullNameDisabled(true);
        window.location.reload();
        showSuccess('Full name updated successfully');
      }
    } catch (error) {
      showError(error.message || 'Failed to edit full name');
    } finally {
      setIsFullNameLoading(false);
    }
  }, [fullName]);

  const editCoverImage = useCallback(async () => {
    try {
      setIsEditing(true);
      if (!coverImage) {
        showError('Please select a cover image');
        return;
      }
      const response = await userApi.updateCoverImage(coverImage);
      if (response.statusCode === 200) {
        window.location.reload();
        showSuccess('Cover image updated successfully');
      }
    } catch (err) {
      showError(err.message || 'Failed to edit cover image');
    } finally {
      setisEditCoverImage(false);
      setIsEditing(false);
    }
  }, [coverImage]);

  const editAvatar = useCallback(async () => {
    try {
      setIsAvatarLoading(true);
      if (!avatar) {
        showError('Please select an avatar');
        return;
      }
      const response = await userApi.updateAvatar(avatar);
      if (response.statusCode === 200) {
        window.location.reload();
        showSuccess('Avatar updated successfully');
      }
    } catch (err) {
      showError(err.message || 'Failed to edit avatar');
    } finally {
      setIsEditAvatar(false);
      setIsAvatarLoading(false);
    }
  }, [avatar]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    showSuccess('Logged out successfully');
  }, [navigate]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!user) return <UserNotFound />;

  const isOwnProfile = currentUser?.username === username;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80"
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

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 -mt-12 md:-mt-16">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 rounded-xl lg:rounded-2xl shadow-xl p-4 md:p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
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
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">@{user.username}</p>
              <ProfileStats user={user} />
              <ActionButtons isOwnProfile={isOwnProfile} handleLogout={handleLogout} />
            </div>
          </div>
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} isOwnProfile={isOwnProfile} />
        </motion.div>
      </div>
      <TabContent activeTab={activeTab} isOwnProfile={isOwnProfile} />
    </motion.div>
  );
};

export default Profile; 