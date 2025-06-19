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
          className="w-full px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 shadow focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-400 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md hover:scale-110 transition-all duration-300"
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
};

export default DesktopSearch; 