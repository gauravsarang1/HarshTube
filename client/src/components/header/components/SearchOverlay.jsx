import { X, Search } from 'lucide-react';

const SearchOverlay = ({ isOpen, onClose, searchQuery, setSearchQuery, handleSearch }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
      <div className="bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
          </form>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay; 