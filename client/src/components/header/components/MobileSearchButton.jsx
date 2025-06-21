import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileSearchButton = ({ onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 px-4 py-2.5  transition-all duration-300 font-semibold group relative overflow-hidden lg:hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/50 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <Search size={24} className="relative text-purple-600 dark:text-purple-400 z-10 group-hover:scale-110 transition-transform duration-200" />
      </button>
    </motion.div>
  );
};

export default MobileSearchButton; 