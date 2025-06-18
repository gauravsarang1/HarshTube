import { Search } from 'lucide-react';

const MobileSearchButton = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center gap-1 px-2 py-1 w-30 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-700 lg:hidden cursor-pointer hover:shadow-sm"
    >
      <span className="text-md font-semibold">Search</span>
      <Search size={20} />
    </div>
  );
};

export default MobileSearchButton; 