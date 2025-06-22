import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { X, Maximize2 } from 'lucide-react';
import { setIsActive, setCurrentTime, setVideoSrc, resetPlayer } from '../../features/body/miniPlayerSlice';

export default function MiniPlayer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isActive, currentTime, videoSrc, videoId, lastVideoTime } = useSelector(state => state.miniPlayer);
  const videoRef = useRef(null);
  const miniRef = useRef(null);
  const animationRef = useRef(null);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 220 });
  const [targetPosition, setTargetPosition] = useState({ x: 20, y: window.innerHeight - 220 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    playerWidth: 320,
    playerHeight: 180
  });

  useEffect(() => {
    if (currentTime && videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Optimized smooth animation - only runs when NOT dragging
  const smoothMove = useCallback(() => {
    if (dragging) return; // Don't animate while dragging
    
    setPosition(current => {
      const dx = targetPosition.x - current.x;
      const dy = targetPosition.y - current.y;
      
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        return targetPosition;
      }
      
      return {
        x: current.x + dx * 0.15, // Slightly slower for smoother feel
        y: current.y + dy * 0.15
      };
    });
    
    animationRef.current = requestAnimationFrame(smoothMove);
  }, [targetPosition, dragging]);

  useEffect(() => {
    if (!dragging) {
      animationRef.current = requestAnimationFrame(smoothMove);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [smoothMove, dragging]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        playerWidth: 320,
        playerHeight: 180
      };
      
      setDimensions(newDimensions);
      
      const constrainedPos = {
        x: Math.min(Math.max(0, targetPosition.x), newDimensions.viewportWidth - newDimensions.playerWidth),
        y: Math.min(Math.max(0, targetPosition.y), newDimensions.viewportHeight - newDimensions.playerHeight)
      };
      
      setTargetPosition(constrainedPos);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetPosition]);

  // Ultra-optimized mouse move handler
  const handleMouseMove = useCallback((e) => {
    const { viewportWidth, viewportHeight, playerWidth, playerHeight } = dimensions;
    
    // Calculate new position with constraints
    const newX = Math.max(0, Math.min(e.clientX - offset.x, viewportWidth - playerWidth));
    const newY = Math.max(0, Math.min(e.clientY - offset.y, viewportHeight - playerHeight));
    
    // Direct position update for immediate response
    setPosition({ x: newX, y: newY });
    setTargetPosition({ x: newX, y: newY });
  }, [offset, dimensions]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = '';
  }, []);

  // Memoized drag start handler
  const startDragging = useCallback((e) => {
    // Prevent dragging on interactive elements
    if (e.target.tagName === 'VIDEO' || 
        e.target.closest('video') || 
        e.target.closest('button')) {
      return;
    }
    
    const rect = miniRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    setDragging(true);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Optimized event listeners
  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: true });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (!dragging) {
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
      }
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    }
  }, [isActive]);

  // Snap to edges when drag ends
  useEffect(() => {
    if (!dragging && isActive) {
      const { viewportWidth, viewportHeight, playerWidth, playerHeight } = dimensions;
      const snapThreshold = 80;
      const margin = 10;

      let newPosition = { ...targetPosition };

      if (targetPosition.x < snapThreshold) {
        newPosition.x = margin;
      }
      else if (targetPosition.x > viewportWidth - playerWidth - snapThreshold) {
        newPosition.x = viewportWidth - playerWidth - margin;
      }

      if (targetPosition.y < snapThreshold) {
        newPosition.y = margin;
      }
      else if (targetPosition.y > viewportHeight - playerHeight - snapThreshold) {
        newPosition.y = viewportHeight - playerHeight - margin;
      }

      if (newPosition.x !== targetPosition.x || newPosition.y !== targetPosition.y) {
        setTargetPosition(newPosition);
      }
    }
  }, [dragging, targetPosition, isActive, dimensions]);

  const handleClose = () => {
    dispatch(resetPlayer());
  };

  const handleMaximize = () => {
    if (videoRef.current) {
      dispatch(setCurrentTime(videoRef.current.currentTime));
    }
    dispatch(setIsActive(false));
    dispatch(setVideoSrc(''));
    navigate(`/watch/${videoId}`);
  };

  if (!isActive) return null;

  // Ensure we have a valid video source
  if (!videoSrc) {
    console.warn('MiniPlayer: No video source provided');
    return null;
  }

  return (
    <div
      ref={miniRef}
      onMouseDown={startDragging}
      className={`group fixed w-80 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl z-50 ${
        dragging ? 'cursor-grabbing shadow-3xl' : 'cursor-grab hover:shadow-3xl'
      }`}
      style={{
        left: position.x,
        top: position.y,
        userSelect: 'none',
        transform: 'translate3d(0, 0, 0)',
        willChange: dragging ? 'transform' : 'auto',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Drag handle area */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent z-10 flex items-center justify-between px-3">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm"></div>
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-sm"></div>
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm"></div>
        </div>
        <div className="flex space-x-1.5">
          <button
            className="text-white hover:text-green-400 text-xl font-bold transition-colors hover:scale-110 group-hover:opacity-100 opacity-0 group-hover:bg-black/50 rounded-full p-1"
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
            title="Maximize player"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            className="text-white hover:text-red-400 text-xl font-bold transition-colors hover:scale-110 group-hover:opacity-100 opacity-0 group-hover:bg-black/50 rounded-full p-1"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            title="Close mini player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <video
        autoPlay
        disablePictureInPicture
        ref={videoRef}
        src={videoSrc}
        controls
        className="w-full h-full object-cover mini-video"
        onMouseDown={(e) => e.stopPropagation()}
        style={{ pointerEvents: 'auto' }}
      />
      
      {/* Visual feedback for dragging */}
      {dragging && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400/50 rounded-xl pointer-events-none"></div>
      )}
    </div>
  );
}