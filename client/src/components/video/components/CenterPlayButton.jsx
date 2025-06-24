import React from 'react';
import { Play, Pause } from 'lucide-react';

const CenterPlayButton = ({ isPlaying, onClick }) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <button
        type="button"
        className="group/button relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-black/70 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out shadow-2xl border border-white/20 hover:bg-black/80 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30"
        tabIndex={0}
        aria-label={isPlaying ? "Pause video" : "Play video"}
        onClick={onClick}
      >
        {/* Ripple effect background */}
        <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover/button:scale-100 transition-transform duration-500 ease-out opacity-0 group-hover/button:opacity-100" />
        
        {/* Pulsing ring animation when playing */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" />
        )}
        
        {/* Icon container with enhanced styling */}
        <div className="relative z-10 flex items-center justify-center">
          {isPlaying ? (
            <Pause className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-2xl filter group-hover/button:text-blue-100 transition-colors duration-200" />
          ) : (
            <Play className="w-6 h-6 md:w-8 md:h-8 text-white drop-shadow-2xl filter group-hover/button:text-blue-100 transition-colors duration-200 ml-0.5 md:ml-1" />
          )}
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
        
        {/* Glowing effect on hover */}
        <div className="absolute inset-0 rounded-full shadow-lg shadow-blue-500/20 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
};

export default CenterPlayButton; 