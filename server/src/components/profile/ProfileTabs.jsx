import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

const ProfileTabs = ({ activeTab, setActiveTab, isOwnProfile }) => {
  const tabs = [
    { id: 'videos', label: 'Videos' },
    { id: 'playlists', label: 'Playlists' },
    ...(isOwnProfile ? [
      { id: 'liked videos', label: 'Liked Videos' },
      { id: 'watch history', label: 'Watch History' }
    ] : [])
  ];

  return (
    <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:border-red-500 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ProfileTabs; 