import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeButton = ({ darkMode, toggleThemeMode }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <button
                onClick={toggleThemeMode}
                className="p-3 text-yellow-600 dark:text-yellow-400 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 hover:from-yellow-200 hover:to-orange-200 dark:hover:from-yellow-800/50 dark:hover:to-orange-800/50 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {darkMode ? (
                    <Sun size={20} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                    <Moon size={20} className="relative z-10 group-hover:rotate-180 transition-transform duration-500" />
                )}
            </button>
        </motion.div>
    )
}

export default ThemeButton;