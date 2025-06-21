import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Check } from 'lucide-react';

const FullNameEditor = ({ fullName, setFullName, fullnameDisabled, setFullNameDisabled, editFullName, isFullNameLoading, isOwnProfile }) => (
  <div className="relative group">
    {/* Main container with modern gradient */}
    <div className="relative overflow-hidden rounded-lg md:rounded-2xl bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900/30 dark:to-indigo-900/30 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[length:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative z-10 flex items-center justify-center md:justify-between gap-1.5 md:gap-3 px-2 md:px-6 py-1.5 md:py-3">
        {/* Decorative accent line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 md:h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-r-full" />
        
        {/* Input field with modern styling */}
        <input 
          disabled={fullnameDisabled}
          className="flex-1 text-center md:text-left text-base md:text-2xl font-bold bg-transparent outline-none focus:ring-2 focus:ring-blue-400/50 dark:focus:ring-blue-500/50 rounded-lg transition-all duration-300 px-1.5 md:px-3 py-0.5 md:py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          value={fullName} 
          onChange={(e) => {setFullName(e.target.value)}} 
          placeholder="Enter your name..."
        />
        
        {/* Action buttons */}
        {isOwnProfile && (
          <div className="flex items-center gap-1 md:gap-2">
            {/* Edit button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className={`relative overflow-hidden p-1 md:p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/50 dark:border-blue-500/50 ${fullnameDisabled && !isFullNameLoading ? 'block' : 'hidden'}`}
              onClick={() => {setFullNameDisabled(!fullnameDisabled)}}
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <Edit size={12} className="md:w-4 md:h-4 relative z-10" />
            </motion.button>
            
            {/* Save button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className={`relative overflow-hidden p-1 md:p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-400/50 dark:border-emerald-500/50 ${fullnameDisabled && !isFullNameLoading ? 'hidden' : 'block'}`}
              onClick={() => {editFullName()}}
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <Check size={12} className="md:w-4 md:h-4 relative z-10" />
            </motion.button>
            
            {/* Loading button */}
            <motion.button
              className={`relative overflow-hidden p-1 md:p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border border-blue-400/50 dark:border-blue-500/50 ${isFullNameLoading ? 'block' : 'hidden'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 animate-pulse" />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="lucide animate-spin lucide-loader-circle-icon lucide-loader-circle md:w-4 md:h-4 relative z-10"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
    
    {/* Glow effect on hover */}
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg md:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
  </div>
);

export default FullNameEditor; 