import { Upload, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import DropDown from '../DropDown';

const AuthenticatedActions = ({ 
  darkMode, 
  toggleThemeMode, 
  userData, 
  handleLogout, 
  navigate 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Link 
        to="/upload" 
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Upload size={24} />
      </Link>
      <button
        onClick={toggleThemeMode}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      <DropDown 
        userData={userData}
        handleTheme={toggleThemeMode}
        handleLogout={handleLogout}
        handleSettings={() => navigate('/settings')}
        handleProfile={() => navigate(`/profile/${userData?.username}`)}
        handleLikedVideos={() => navigate('/liked-videos')}
        handleWatchHistory={() => navigate('/watch-history')}
      />
    </div>
  );
};

export default AuthenticatedActions; 