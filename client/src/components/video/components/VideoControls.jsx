import React from 'react';
import { Play, Pause, Minimize2 } from 'lucide-react';
import QualitySelector from './QualitySelector';

const VideoControls = ({ 
  isPlaying, 
  togglePlayPause, 
  currentProgress,
  duration,
  currentQuality,
  onQualityChange,
  onMinimize,
  formatTime 
}) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlayPause}
          className="p-1.5 md:p-2 bg-black/50 rounded-full hover:bg-black/70 transition-all"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 md:w-5 md:h-5 text-white" />
          ) : (
            <Play className="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5" />
          )}
        </button>
        <div className="text-white text-xs md:text-sm">
          <span>{formatTime(currentProgress)}</span>
          <span className="mx-1">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <QualitySelector
          currentQuality={currentQuality}
          onQualityChange={onQualityChange}
        />
        <button
          onClick={onMinimize}
          className="p-1.5 md:p-2 bg-black/50 rounded-full hover:bg-black/70 transition-all"
        >
          <Minimize2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoControls; 