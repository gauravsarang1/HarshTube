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
    <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80 fixed h-full overflow-y-auto transition-all duration-300 z-40 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 shadow-xl`}>
      <div className="p-3">
        {/* Main Navigation */}
        <div className="mb-4 hidden md:block">
          <div className="flex items-center p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl cursor-pointer transition-all shadow hover:scale-105">
            <Home size={20} />
            {sidebarOpen && <span className="ml-6 font-medium">Home</span>}
          </div>
          <div className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-xl cursor-pointer transition-all shadow">
            <Scissors size={20} />
            {sidebarOpen && <span className="ml-6">Shorts</span>}
          </div>
          <div className="flex items-center p-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl cursor-pointer transition-all shadow">
            <Play size={20} />
            {sidebarOpen && <span className="ml-6">Subscriptions</span>}
            {sidebarOpen && <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>}
          </div>
        </div>

        {sidebarOpen && (
          <>
            {/* You Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-4">
              <div className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-xl cursor-pointer transition-all shadow">
                <span className="text-lg font-medium">You</span>
                <ChevronRight size={16} className="ml-2" />
              </div>
              <div className="flex items-center p-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl cursor-pointer transition-all shadow">
                <Clock size={20} />
                <span className="ml-6">History</span>
              </div>
              <div className="flex items-center p-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl cursor-pointer transition-all shadow">
                <List size={20} />
                <span className="ml-6">Playlists</span>
              </div>
              <div className="flex items-center p-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl cursor-pointer transition-all shadow">
                <PlaySquare size={20} />
                <span className="ml-6">Your videos</span>
              </div>
              <div className="flex items-center p-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl cursor-pointer transition-all shadow">
                <GraduationCap size={20} />
                <span className="ml-6">Your courses</span>
              </div>
              <div className="flex items-center p-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl cursor-pointer transition-all shadow">
                <ThumbsUp size={20} />
                <span className="ml-6">Liked videos</span>
              </div>
            </div>

            {/* Subscriptions Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-4">
              <h3 className="px-3 py-2 font-bold text-lg text-gray-900 dark:text-white">Subscriptions</h3>
              {subscriptions.slice(0, showMoreSubs ? subscriptions.length : 5).map((sub, index) => (
                <div key={index} className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-xl cursor-pointer transition-all shadow">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm">
                    {sub.avatar}
                  </div>
                  <span className="ml-6 flex-1">{sub.name}</span>
                  {sub.online && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                </div>
              ))}
              <div 
                className="flex items-center p-3 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-xl cursor-pointer transition-all shadow"
                onClick={() => setShowMoreSubs(!showMoreSubs)}
              >
                {showMoreSubs ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <span className="ml-6">{showMoreSubs ? 'Show less' : 'Show more'}</span>
              </div>
            </div>

            {/* Explore Section */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
              <h3 className="px-3 py-2 font-bold text-lg text-gray-900 dark:text-white">Explore</h3>
              <div className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-xl cursor-pointer transition-all shadow">
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
