import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from 'lucide-react';

const QualitySelector = ({ currentQuality, onQualityChange }) => {
  const qualities = [
    { label: '1080p', value: 'q_auto:best' },
    { label: '720p', value: 'q_auto:good' },
    { label: '480p', value: 'q_auto:eco' },
    { label: '360p', value: 'q_auto:low' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 md:p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all">
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {qualities.map((quality) => (
          <DropdownMenuItem
            key={quality.value}
            className={`flex items-center justify-between ${
              currentQuality === quality.value ? 'bg-blue-50 dark:bg-blue-900/50' : ''
            }`}
            onClick={() => onQualityChange(quality.value)}
          >
            <span>{quality.label}</span>
            {currentQuality === quality.value && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QualitySelector; 