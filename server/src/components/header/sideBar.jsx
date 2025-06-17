import React, { useState, createContext, useContext, useEffect } from 'react';
import { Menu, Search, Mic, Plus, Bell, User, Home, Scissors, Play, Clock, List, PlaySquare, GraduationCap, ThumbsUp, ChevronRight, ChevronDown, TrendingUp, Sun, Moon } from 'lucide-react';

// Sidebar Component
const Sidebar = ({ sidebarOpen, showMoreSubs, setShowMoreSubs }) => {
  const { darkMode } = useTheme();

  const subscriptions = [
    { name: "Army Study IN", avatar: "🔺", online: true },
    { name: "Chai aur Code", avatar: "👨‍💻", online: true },
    { name: "Harkirat Singh", avatar: "👨", online: true },
    { name: "Rishabh Bidhuri", avatar: "👨‍🦱", online: true },
    { name: "CarryMinati", avatar: "👱", online: true },
    { name: "Simplify with Ankit", avatar: "👨‍🏫", online: true },
    { name: "Naresh i Technologies", avatar: "👨‍💼", online: true },
  ];

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-900 fixed h-full overflow-y-auto transition-all duration-300 z-40 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800`}>
      <div className="p-2">
        {/* Main Navigation */}
        <div className="mb-4 hidden md:block">
          <div className="flex items-center p-3 bg-gray-200 dark:bg-gray-800 rounded-lg cursor-pointer transition-colors">
            <Home size={20} />
            {sidebarOpen && <span className="ml-6 font-medium">Home</span>}
          </div>
          <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
            <Scissors size={20} />
            {sidebarOpen && <span className="ml-6">Shorts</span>}
          </div>
          <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
            <Play size={20} />
            {sidebarOpen && <span className="ml-6">Subscriptions</span>}
            {sidebarOpen && <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>}
          </div>
        </div>

        {sidebarOpen && (
          <>
            {/* You Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-4">
              <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                <span className="text-lg font-medium">You</span>
                <ChevronRight size={16} className="ml-2" />
              </div>
              <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                <Clock size={20} />
                <span className="ml-6">History</span>
              </div>
              <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                <List size={20} />
                <span className="ml-6">Playlists</span>
              </div>
              <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                <PlaySquare size={20} />
                <span className="ml-6">Your videos</span>
              </div>
              <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                <GraduationCap size={20} />
                <span className="ml-6">Your courses</span>
              </div>
              <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                <ThumbsUp size={20} />
                <span className="ml-6">Liked videos</span>
              </div>
            </div>

            {/* Subscriptions Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-4">
              <h3 className="px-3 py-2 font-medium text-lg">Subscriptions</h3>
              {subscriptions.slice(0, showMoreSubs ? subscriptions.length : 5).map((sub, index) => (
                <div key={index} className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm">
                    {sub.avatar}
                  </div>
                  <span className="ml-6 flex-1">{sub.name}</span>
                  {sub.online && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                </div>
              ))}
              <div 
                className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                onClick={() => setShowMoreSubs(!showMoreSubs)}
              >
                {showMoreSubs ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <span className="ml-6">{showMoreSubs ? 'Show less' : 'Show more'}</span>
              </div>
            </div>

            {/* Explore Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
              <h3 className="px-3 py-2 font-medium text-lg">Explore</h3>
              <div className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                <TrendingUp size={20} />
                <span className="ml-6">Trending</span>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
