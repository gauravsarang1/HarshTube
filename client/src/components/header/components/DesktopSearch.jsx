import { Search, Sparkles, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const DesktopSearch = ({ searchQuery, setSearchQuery, handleSearch, handleSparkle, isSparkleClicked }) => {
  return (
    <div className="hidden lg:block flex-1 max-w-2xl mx-8">
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for videos, channels, or topics..."
            className="w-full px-6 py-3.5 rounded-xl border-2 border-gray-200/50 dark:border-gray-600/50 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-400 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white font-medium pr-40"
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {/* Sparkle Button */}
            {/*<motion.button
              type="button"
              onClick={handleSparkle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
            >
              <Sparkles size={16} />
            </motion.button>*/}
            {/* Voice Search Button */}
            <motion.button
              type="button"
              onClick={handleSparkle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`${isSparkleClicked ? 'bg-gradient-to-br from-sky-400 to-indigo-600 hover:from-sky-500 hover:to-indigo-700 animate-pulse opacity-100' : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'} p-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center`}
            >
              <Mic size={16} />
            </motion.button>

            {/* Search Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <Search size={18} />
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DesktopSearch; 