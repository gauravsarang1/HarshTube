import React, { useState, useRef } from 'react';

const VideoProgress = ({ 
  currentProgress, 
  duration, 
  onSeek,
  onPreview,
  buffered,
  formatTime 
}) => {
  const progressBarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTimelineClick = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width);
    
    if (percentage >= 0 && percentage <= 1) {
      const newTime = percentage * duration;
      onSeek(newTime);
    }
  };

  const handleTimelineMouseMove = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    
    if (percentage >= 0 && percentage <= 1) {
      const previewTime = percentage * duration;
      onPreview(previewTime);
    }
  };

  const handleTimelineDragStart = (e) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleTimelineMouseMove);
    document.addEventListener('mouseup', handleTimelineDragEnd);
  };

  const handleTimelineDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleTimelineMouseMove);
    document.removeEventListener('mouseup', handleTimelineDragEnd);
    
    if (progressBarRef.current) {
      onSeek(currentProgress);
    }
  };

  return (
    <div className="px-4">
      <div 
        ref={progressBarRef}
        className="relative h-1 group/timeline cursor-pointer"
        onClick={handleTimelineClick}
        onMouseDown={handleTimelineDragStart}
      >
        {/* Background bar */}
        <div className="absolute inset-0 rounded-full bg-gray-600/50" />
        
        {/* Buffered progress */}
        {buffered > 0 && (
          <div 
            className="absolute h-full bg-gray-400/50 rounded-full"
            style={{ width: `${(buffered / duration) * 100}%` }} 
          />
        )}

        {/* Played progress */}
        <div 
          className="absolute h-full bg-blue-500 rounded-full transition-all duration-100"
          style={{ width: `${(currentProgress / duration) * 100}%` }}
        />

        {/* Hover effect */}
        <div className="absolute inset-y-0 w-full -inset-x-2 opacity-0 group-hover/timeline:opacity-100">
          <div className="absolute inset-y-0 w-full -inset-x-2 bg-white/10 rounded-full transform scale-y-150 transition-transform" />
        </div>

        {/* Draggable handle */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-blue-500 rounded-full shadow-md transform -translate-x-1/2 transition-opacity duration-200 ${
            isDragging ? 'opacity-100 scale-125' : 'opacity-0 group-hover/timeline:opacity-100'
          }`}
          style={{ left: `${(currentProgress / duration) * 100}%` }}
        />

        {/* Time preview */}
        <div 
          className={`absolute bottom-4 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200 ${
            isDragging ? 'opacity-100' : 'opacity-0 group-hover/timeline:opacity-100'
          }`}
          style={{ left: `${(currentProgress / duration) * 100}%` }}
        >
          {formatTime(currentProgress)}
        </div>
      </div>

      {/* Buffer progress dots */}
      <div className="h-1 w-full flex justify-end space-x-0.5 mt-0.5">
        {buffered > 0 && Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i}
            className="h-1 w-1 rounded-full bg-blue-500/50 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoProgress; 