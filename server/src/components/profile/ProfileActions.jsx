import { motion } from 'framer-motion';
import { LogOut, Settings, UserPlus, Bell, Share2 } from 'lucide-react';
import { Button } from '../ui/button';

const ProfileActions = ({ isOwnProfile, handleLogout }) => {
  return (
    <div className="mt-6 flex gap-3 justify-center md:justify-start">
      {isOwnProfile ? (
        <>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings size={20} />
            Settings
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
          >
            <UserPlus size={20} />
            Subscribe
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Bell size={20} />
            Notifications
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 size={20} />
            Share
          </Button>
        </>
      )}
    </div>
  );
};

export default ProfileActions; 