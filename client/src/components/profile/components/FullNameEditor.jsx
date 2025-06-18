import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Check } from 'lucide-react';

const FullNameEditor = ({ fullName, setFullName, fullnameDisabled, setFullNameDisabled, editFullName, isFullNameLoading, isOwnProfile }) => (
  <div className="flex items-center justify-center md:justify-start gap-2">
    <input 
      disabled={fullnameDisabled}
      className="text-2xl text-center md:text-left font-bold text-gray-900 dark:text-white bg-transparent outline-none" 
      value={fullName} 
      onChange={(e) => {setFullName(e.target.value)}} 
    />
    {isOwnProfile && (
      <>
         <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${fullnameDisabled && !isFullNameLoading ? 'block' : 'hidden'}`}
      onClick={() => {setFullNameDisabled(!fullnameDisabled)}}
    >
      <Edit size={18} />
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${fullnameDisabled && !isFullNameLoading ? 'hidden' : 'block'}`}
      onClick={() => {editFullName()}}
    >
      <Check size={18} />
    </motion.button>
    <motion.button
      className={`bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300 ${isFullNameLoading ? 'block' : 'hidden'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide animate-spin lucide-loader-circle-icon lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    </motion.button>
      </>
    )}
   
  </div>
);

export default FullNameEditor; 