import { Search } from 'lucide-react';

const DesktopSearch = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <div className="hidden lg:block flex-1 max-w-2xl mx-8">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
};

export default DesktopSearch; 