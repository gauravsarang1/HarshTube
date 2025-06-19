import { X, Search } from 'lucide-react';

const SearchOverlay = ({ isOpen, onClose, searchQuery, setSearchQuery, handleSearch }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden flex items-center justify-center">
      <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-6 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm w-full max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 shadow focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-400 placeholder-gray-400 dark:placeholder-gray-500"
              autoFocus
            />
          </form>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-md hover:scale-110 transition-all duration-300 ml-2"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay; 