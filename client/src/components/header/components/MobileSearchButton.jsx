import { Search } from 'lucide-react';

const MobileSearchButton = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-2 w-32 rounded-xl border-2 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-200 bg-gradient-to-br from-white to-blue-50/80 dark:from-blue-900 dark:to-blue-950 shadow-md lg:hidden cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
    >
      <span className="text-md font-semibold">Search</span>
      <Search size={20} />
    </div>
  );
};

export default MobileSearchButton; 