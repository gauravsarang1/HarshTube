import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Moon, Shield, LogOut, Save, Camera, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    comments: true,
    likes: true
  });

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User, color: 'blue' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'green' },
    { id: 'appearance', label: 'Appearance', icon: Moon, color: 'purple' },
    { id: 'privacy', label: 'Privacy', icon: Shield, color: 'orange' }
  ];

  const ModernToggle = ({ checked, onChange, disabled = false }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className={`relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-blue-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 peer-checked:opacity-100 transition-opacity duration-300" />
      </div>
    </label>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-8">
            {/* Profile Picture Section */}
            <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                Profile Picture
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                    JD
                  </div>
                  <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Change Photo
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                Notification Preferences
              </h3>
              <div className="space-y-6">
                {[
                  { key: 'email', title: 'Email Notifications', desc: 'Receive email updates about your account activity' },
                  { key: 'push', title: 'Push Notifications', desc: 'Get instant notifications on your device' },
                  { key: 'comments', title: 'Comment Notifications', desc: 'Get notified when someone comments on your content' },
                  { key: 'likes', title: 'Like Notifications', desc: 'Get notified when someone likes your content' },
                  { key: 'marketing', title: 'Marketing Emails', desc: 'Receive promotional emails and product updates' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-300">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                    </div>
                    <ModernToggle
                      checked={notifications[item.key]}
                      onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
                Theme Settings
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-300">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Switch between light and dark theme</p>
                  </div>
                  <ModernToggle
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                </div>
                
                {/* Theme Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-white border-2 border-blue-200 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300">
                    <div className="w-full h-20 bg-gradient-to-br from-blue-50 to-white rounded-lg mb-3"></div>
                    <p className="font-medium text-center">Light Theme</p>
                  </div>
                  <div className="p-4 bg-gray-800 border-2 border-gray-600 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300">
                    <div className="w-full h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg mb-3"></div>
                    <p className="font-medium text-center text-white">Dark Theme</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                Privacy Settings
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-300">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Profile Visibility</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Control who can see your profile and content</p>
                  </div>
                  <select className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300">
                    <option value="public">🌍 Public</option>
                    <option value="private">🔒 Private</option>
                    <option value="friends">👥 Friends Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-300">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Activity Status</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Show when you're active or online</p>
                  </div>
                  <ModernToggle
                    checked={true}
                    onChange={() => {}}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-300">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Search Engine Indexing</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Allow search engines to index your profile</p>
                  </div>
                  <ModernToggle
                    checked={false}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <SettingsIcon className="w-10 h-10 text-gray-800 dark:text-gray-100" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? `bg-gradient-to-r from-${tab.color}-50 to-${tab.color}-100/50 dark:from-${tab.color}-900/30 dark:to-${tab.color}-800/20 text-${tab.color}-600 dark:text-${tab.color}-400 shadow-lg border border-${tab.color}-200/50 dark:border-${tab.color}-700/50`
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:scale-105'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? `bg-${tab.color}-100 dark:bg-${tab.color}-900/50` : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'} transition-colors duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold">{tab.label}</span>
                    </button>
                  );
                })}
                
                {/* Logout Button */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors duration-300">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;