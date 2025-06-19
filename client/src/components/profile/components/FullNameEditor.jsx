import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Check } from 'lucide-react';

const FullNameEditor = ({ fullName, setFullName, fullnameDisabled, setFullNameDisabled, editFullName, isFullNameLoading, isOwnProfile }) => (
  <div className="flex items-center justify-center md:justify-between gap-2 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 rounded-xl shadow-md px-4 py-2 border border-blue-200 dark:border-blue-800">
    <input 
      disabled={fullnameDisabled}
      className="text-2xl text-center md:text-left font-bold text-gray-900 dark:text-white bg-transparent outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 rounded-lg transition-all duration-300 px-2 py-1"
      value={fullName} 
      onChange={(e) => {setFullName(e.target.value)}} 
    />
    {isOwnProfile && (
      <>
         <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`bg-gradient-to-r from-blue-400 to-purple-500 text-white p-2 rounded-full shadow hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-800 ${fullnameDisabled && !isFullNameLoading ? 'block' : 'hidden'}`}
      onClick={() => {setFullNameDisabled(!fullnameDisabled)}}
    >
      <Edit size={18} />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`bg-gradient-to-r from-green-400 to-emerald-500 text-white p-2 rounded-full shadow hover:scale-110 transition-all duration-300 border-2 border-white dark:border-gray-800 ${fullnameDisabled && !isFullNameLoading ? 'hidden' : 'block'}`}
      onClick={() => {editFullName()}}
    >
      <Check size={18} />
    </motion.button>
    <motion.button
      className={`bg-gradient-to-r from-blue-400 to-purple-600 text-white p-2 rounded-full shadow-md border-2 border-white dark:border-gray-800 ${isFullNameLoading ? 'block' : 'hidden'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    </motion.button>
      </>
    )}
   
  </div>
);

export default FullNameEditor; 