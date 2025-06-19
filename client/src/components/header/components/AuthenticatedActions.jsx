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
    <div className="flex items-center gap-3">
      <Link 
        to="/upload" 
        className="p-2 text-blue-500 hover:text-white rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 shadow-md hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300"
      >
        <Upload size={24} />
      </Link>
      <button
        onClick={toggleThemeMode}
        className="p-2 text-yellow-500 hover:text-white rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 dark:from-yellow-900 dark:to-yellow-700 shadow-md hover:bg-gradient-to-br hover:from-yellow-400 hover:to-yellow-600 transition-all duration-300"
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