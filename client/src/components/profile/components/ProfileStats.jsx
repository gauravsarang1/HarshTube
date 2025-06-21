import React from 'react';
import { motion } from 'framer-motion';
import { Video, Users, Eye, ThumbsUp } from 'lucide-react';

const ProfileStats = ({ user }) => {
  console.log(user);
  const stats = [
    {
      icon: Video,
      label: 'Videos',
      value: user.totalVideos || 0,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      darkBgColor: 'from-blue-900/20 to-cyan-900/20',
      borderColor: 'border-blue-200',
      darkBorderColor: 'border-blue-700/50'
    },
    {
      icon: Users,
      label: 'Subscribers',
      value: user.subscribersCount || 0,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      darkBgColor: 'from-purple-900/20 to-pink-900/20',
      borderColor: 'border-purple-200',
      darkBorderColor: 'border-purple-700/50'
    },
    {
      icon: Eye,
      label: 'Views',
      value: user.totalViews || 0,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      darkBgColor: 'from-emerald-900/20 to-teal-900/20',
      borderColor: 'border-emerald-200',
      darkBorderColor: 'border-emerald-700/50'
    },
    {
      icon: ThumbsUp,
      label: 'Likes',
      value: user.totalLikes || 0,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      darkBgColor: 'from-orange-900/20 to-red-900/20',
      borderColor: 'border-orange-200',
      darkBorderColor: 'border-orange-700/50'
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="mt-2 md:mt-4 grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative group cursor-pointer overflow-hidden rounded-lg md:rounded-2xl p-2 md:p-4 bg-gradient-to-br ${stat.bgColor} dark:${stat.darkBgColor} border ${stat.borderColor} dark:${stat.darkBorderColor} shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm`}
        >
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          
          {/* Icon */}
          <div className={`relative z-10 flex items-center justify-center w-6 h-6 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg mb-1.5 md:mb-3 group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon size={14} className="md:w-5 md:h-5 text-white" />
          </div>
          
          {/* Value */}
          <div className="relative z-10">
            <div className={`text-sm md:text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {formatNumber(stat.value)}
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {stat.label}
            </div>
          </div>
          
          {/* Subtle glow effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileStats; 