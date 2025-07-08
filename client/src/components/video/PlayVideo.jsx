import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link ,useLocation} from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, Play, Pause, MessageCircle, Share2, Clock, Eye, MoreVertical, ThumbsDown, Flag, BookmarkPlus, ChevronLeft, ChevronRight, Loader2, Minimize2 } from 'lucide-react';
import Comments from '../comments/Comments';
import { useDispatch, useSelector } from 'react-redux';
import { setIsActive, setCurrentTime, setVideoSrc, setVideoId} from '../../features/body/miniPlayerSlice';
import { useSocket } from '../../context/SocketContext';
import { setVideoTitle } from '../../features/body/commentSlice';
import { useSubscription } from '../../hooks/useSubscription';
import QualitySelector from './components/QualitySelector';
import VideoControls from './components/VideoControls';
import VideoProgress from './components/VideoProgress';
import CenterPlayButton from './components/CenterPlayButton';

const PlayVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentTime, isActive, lastVideoTime } = useSelector(state => state.miniPlayer);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reactionType, setReactionType] = useState('like');
  const [videoLikes, setVideoLikes] = useState([]);
  const [videoDislikes, setVideoDislikes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [totalSubscribersCount, setTotalSubscribersCount] = useState(0);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [watchHistoryAdded, setWatchHistoryAdded] = useState(false);
  const [views, setViews] = useState(0);
  const [isViewed, setIsViewed] = useState(false);
  const [videoQuality, setVideoQuality] = useState(null);
  const socket = useSocket();
  const {
    isSubscribed,
    subscriberCount,
    loading: subscriptionLoading,
    error: subscriptionError,
    toggleSubscription
  } = useSubscription(video?.owner?._id);
  const [currentQuality, setCurrentQuality] = useState('q_auto:good');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef(null);
  const [pendingSeekTime, setPendingSeekTime] = useState(null);
  
  //const [subscriber, setSubscriber] = useState('');

  // Initialize current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    if (token && user) {
      setCurrentUser(user);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    if (videoRef.current) {
      // If coming from miniplayer, use lastVideoTime
      if (lastVideoTime && !isActive) {
        videoRef.current.currentTime = lastVideoTime;
        console.log('lastVideoTime', lastVideoTime);
      }
      // Otherwise use currentTime if available
      else if (currentTime) {
        videoRef.current.currentTime = currentTime;
        console.log('currentTime', currentTime);
      }
      
      if (!isActive) {
        videoRef.current.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      }

       setIsPlaying(!videoRef.current.paused && !videoRef.current.ended);
    }
  }, [currentTime, lastVideoTime, isActive, navigate, videoRef?.current]);

  useEffect(() => {
    if(videoEnded && relatedVideos.length > 0){
      setIsPlaying(false);
      videoRef.current?.pause();
      setTimeout(() => {
        const nextVideoId = relatedVideos[0]._id;
        navigate(`/watch/${nextVideoId}`);
      }, 2000);
      setVideoEnded(false);
       // Reset the flag
    }
  },[videoEnded, relatedVideos])

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_BASE_URL}/videos/${videoId}`, { headers });
      
      const videoData = response.data.data;
      setVideo(videoData);
      setDuration(videoData.duration);
      dispatch(setVideoTitle(videoData.title));
      setError(null);

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
        setCurrentUser(null);
        // We don't navigate to login, just show public content
      } else {
        setError('Failed to fetch video. Please try again later.');
        console.error('Error fetching video:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchViews = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE_URL}/views/${videoId}`, {headers});

      const {totalViews, isViewed} = response.data.data;
      setViews(totalViews);
      setIsViewed(isViewed);
    } catch (err) {
      console.error('Error fetching views:', err);
    }
  }

  useEffect(() => {
    if (!socket) return;
    socket.on('views-updated', (data) => {
      if (data.videoId === videoId) {
        fetchViews();
      }
    });
    return () => {
      socket.off('views-updated', (data) => {
        if (data.videoId === videoId) {
          fetchViews();
        }
      });
    };
  }, [socket, videoId]);

  const fetchRelatedVideos = useCallback(async (page) => {
    try {
      setLoadingMore(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `${API_BASE_URL}/videos/all-videos?page=${page}&limit=${10}`,
        { headers }
      );

      const { videos: videoList, hasMore: more } = response.data.data;
      
      const filteredVideos = videoList.filter(v => v._id !== videoId);
      const randomVideos = filteredVideos.sort(() => Math.random() - 0.5);
      
      if (page === 1) {
        setRelatedVideos(randomVideos);
      } else {
        setRelatedVideos(prev => {
          const existingIds = new Set(prev.map(v => v._id));
          const newVideos = filteredVideos.filter(v => !existingIds.has(v._id));
          return [...prev, ...newVideos];
        });
      }
      
      setHasMore(more);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching related videos:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchVideo();
    fetchRelatedVideos(1);
    fetchViews();
    if (loggedIn) {
      getAllReactions();
    }
    // Reset watch history flag when video changes
    setWatchHistoryAdded(false);
  }, [videoId, fetchRelatedVideos, loggedIn]);

  useEffect(() => {
    if (!socket) return;

    const handleReactionUpdate = (data) => {
        if (data.videoId === videoId) {
            console.log(`Reaction updated for video ${videoId}, refetching...`);
            getAllReactions();
        }
    };

    socket.on('video-reaction-updated', handleReactionUpdate);

    return () => {
        socket.off('video-reaction-updated', handleReactionUpdate);
    };
  }, [socket, videoId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000; // Load more when 1000px from bottom

      if (scrollPosition >= threshold) {
        if (!loadingMore && hasMore) {
          fetchRelatedVideos(currentPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, currentPage, fetchRelatedVideos]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const togglePlayPause = () => {
    if(isPlaying){
      videoRef.current.pause();
      setIsPlaying(false);
    }else{
      videoRef.current.play();
      setIsPlaying(true);
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      // Add to watch history when video starts playing (only once per video)
      if (!watchHistoryAdded && loggedIn) {
        console.log('Video started playing, adding to watch history...');
        addToWatchHistory(videoId);
        setWatchHistoryAdded(true);
      }
    };
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Set initial state
    setIsPlaying(true);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef.current, watchHistoryAdded, loggedIn, videoId]);

  const getAllReactions = async () => {
    if (!loggedIn) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const headers = { Authorization: `Bearer ${token}` };
  
      const [likesRes, dislikesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/likes/get/video/likes/${videoId}`, { headers }),
        axios.get(`${API_BASE_URL}/likes/get/video/disLikes/${videoId}`, { headers })
      ]);
  
      const likes = likesRes.data?.data || [];
      const dislikes = dislikesRes.data?.data || [];
      //console.log( 'likes', likes, 'dislikes', dislikes);
  
      setVideoLikes(likes);
      setVideoDislikes(dislikes);
  
      
      const userId = currentUser.id;
      //console.log( 'currentUser', currentUser.id);

      // Ensure only one reaction is active
      const hasLiked = likes.some(reaction => reaction.likedById === userId);
      const hasDisliked = dislikes.some(reaction => reaction.dislikedById === userId);
      //console.log( 'hasLiked', hasLiked, 'hasDisliked', hasDisliked);

      // If somehow both are true, prefer like over dislike
      if (hasLiked && hasDisliked) {
        setLiked(false);
        setDisliked(false);
      } else {
        setLiked(hasLiked);
        setDisliked(hasDisliked);
      }
  
    } catch (error) {
      console.error('Error fetching reactions:', error);
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
        setCurrentUser(null);
      }
      setVideoLikes([]);
      setVideoDislikes([]);
      setLiked(false);
      setDisliked(false);
    }
  };

  const toggleVideoReaction = async (reactionType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // The server will emit an event that triggers a re-fetch
      await axios.post(
        `${API_BASE_URL}/likes/toggle/v/${videoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { reactionType }
        }
      );

      if (!response.data?.data) {
        return;
      }

      const reaction = response.data.data;
      
      // Update states based on API response
      if (reaction.type === 'like') {
        setLiked(true);
        setDisliked(false);
        setVideoLikes(prev => {
          const filtered = prev.filter(r => r.owner !== reaction.owner);
          return [...filtered, reaction];
        });
        setVideoDislikes(prev => prev.filter(r => r.owner !== reaction.owner));
      } else if (reaction.type === 'disLike') {
        setDisliked(true);
        setLiked(false);
        setVideoDislikes(prev => {
          const filtered = prev.filter(r => r.owner !== reaction.owner);
          return [...filtered, reaction];
        });
        setVideoLikes(prev => prev.filter(r => r.owner !== reaction.owner));
      } else {
        // Handle removal of reaction
        if (reactionType === 'like') {
          setLiked(false);
          setVideoLikes(prev => prev.filter(r => r.owner !== reaction.owner));
        } else {
          setDisliked(false);
          setVideoDislikes(prev => prev.filter(r => r.owner !== reaction.owner));
        }
      }

    } catch (err) {
      console.error('Error toggling video reaction:', err);
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
        setCurrentUser(null);
      }
    }
  };

  //console.log('videoLikes',videoLikes, 'videoDislikes', videoDislikes);
  
  
  useEffect(() => {
    if(videoId){
      getAllReactions();
    }
  }, [videoId, toggleVideoReaction]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const handleSubscribe = async () => {
    if (!loggedIn) {
      navigate('/login');
      return;
    }
    
    try {
      await toggleSubscription();
    } catch (err) {
      console.error('Error subscribing:', err);
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoggedIn(false);
        setCurrentUser(null);
        navigate('/login');
      }
    }
  };

  const openMiniPlayer = (videoSrc) => {
    if (videoRef.current) {
      const currentVideoTime = videoRef.current.currentTime;
      dispatch(setVideoSrc(videoSrc));
      dispatch(setIsActive(true));
      dispatch(setCurrentTime(currentVideoTime));
      dispatch(setVideoId(videoId));
      videoRef.current.pause();
    }
  };


  const addToWatchHistory = async (videoId) => {
    if (!loggedIn) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.post(`${API_BASE_URL}/watch-history/add/${videoId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response.data.data);
    } catch (err) {
      console.error('Error adding to watch history:', err);
    }
  }

  useEffect(() => {
    const addView = async () => {
      if (!loggedIn) return;
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
  
        const response = await axios.post(`${API_BASE_URL}/views/add/${videoId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error('Error adding view:', err);
      }
    }
    addView();
  }, [videoId, loggedIn]);

  const handleQualityChange = (quality) => {
    console.log('quality changed to ', quality);
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;
      setPendingSeekTime({ time: currentTime, shouldPlay: wasPlaying });
      setCurrentQuality(quality);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      if (pendingSeekTime !== null) {
        video.currentTime = pendingSeekTime.time;
        setCurrentProgress(pendingSeekTime.time);
        if (pendingSeekTime.shouldPlay) {
          video.play();
        }
        setPendingSeekTime(null);
      } else if (lastVideoTime && !isActive) {
        video.currentTime = lastVideoTime;
        setCurrentProgress(lastVideoTime);
      } else if (currentTime) {
        video.currentTime = currentTime;
        setCurrentProgress(currentTime);
      }

      if (!isActive && isPlaying) {
        video.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoRef.current, pendingSeekTime, lastVideoTime, currentTime, isActive, isPlaying]);



  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width);
    
    if (percentage >= 0 && percentage <= 1) {
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentProgress(newTime);
    }
  };

  const handleTimelineMouseMove = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    
    if (percentage >= 0 && percentage <= 1) {
      const previewTime = percentage * duration;
      setCurrentProgress(previewTime);
    }
  };

  // Add this new function to handle dragging
  const [isDragging, setIsDragging] = useState(false);

  const handleTimelineDragStart = (e) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleTimelineMouseMove);
    document.addEventListener('mouseup', handleTimelineDragEnd);
  };

  const handleTimelineDragEnd = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleTimelineMouseMove);
    document.removeEventListener('mouseup', handleTimelineDragEnd);
    
    if (videoRef.current) {
      videoRef.current.currentTime = currentProgress;
    }
  };

  useEffect(() => {
    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    const handleTimeUpdate = () => {
      setCurrentProgress(currentVideo.currentTime);
    };

    currentVideo.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoRef.current]);

  const getBufferedTime = () => {
    if (!videoRef.current?.buffered?.length) return 0;
    return videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
  };

  const handleReletedVideoClick = () => {
    dispatch(setCurrentTime(0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="animate-pulse bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-lg"></div>
                <div className="mt-4 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                  <div className="flex gap-2">
                    <div className="bg-gray-200 dark:bg-gray-700 w-40 h-24 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500 dark:text-red-400 font-semibold text-lg">{error}</p>
          <button
            onClick={fetchVideo}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16 md:pt-20 px-2 sm:px-4 lg:px-8 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          <div className="lg:col-span-2 ">
            <div className="aspect-video group relative rounded-xl lg:rounded-2xl overflow-hidden bg-black shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <video
                ref={videoRef}
                src={`${video.filePath.split('/upload/')[0]}/upload/${currentQuality}/${video.filePath.split('/upload/')[1]}`}
                className="w-full h-full main-video"
                poster={video.thumbnail}
                autoPlay={isPlaying}
                disablePictureInPicture={true}
                onEnded={() => setVideoEnded(true)}
                playsInline
                preload="metadata"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               
                <VideoControls
                  isPlaying={isPlaying}
                  togglePlayPause={togglePlayPause}
                  currentProgress={currentProgress}
                  duration={duration}
                  currentQuality={currentQuality}
                  onQualityChange={handleQualityChange}
                  onMinimize={() => openMiniPlayer(video.filePath)}
                  formatTime={formatTime}
                />
                 <VideoProgress
                currentProgress={currentProgress}
                duration={duration}
                onSeek={(time) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = time;
                    setCurrentProgress(time);
                  }
                }}
                onPreview={setCurrentProgress}
                buffered={getBufferedTime()}
                formatTime={formatTime}
              />
              </div>
              
              <CenterPlayButton
                isPlaying={isPlaying}
                onClick={togglePlayPause}
              />
            </div>
           

            {/* Video Info */}
            <div className="mt-4 md:mt-6 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-4 md:p-8 rounded-xl lg:rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="w-1.5 h-6 md:w-2 md:h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                <h1 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 line-clamp-2 text-ellipsis overflow-hidden dark:text-white/90">
                  {video.title}
                </h1>
              </div>

              {/* Video Stats and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="md:w-4 md:h-4" />
                    <span>{views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="md:w-4 md:h-4" />
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                <button
                    onClick={() => toggleVideoReaction('like')}
                    className={`flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-full font-semibold transition-all duration-300 shadow-sm text-xs md:text-sm
                      ${liked
                        ? 'bg-blue-500 text-white scale-105 shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900'}
                    `}
                  >
                    <ThumbsUp size={14} className="md:w-4 md:h-4" />
                    <span>{videoLikes.length || 0}</span>
                  </button>

                  <button
                    onClick={() => toggleVideoReaction('disLike')}
                    className={`flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-full font-semibold transition-all duration-300 shadow-sm text-xs md:text-sm
                      ${disliked
                        ? 'bg-red-500 text-white scale-105 shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'}
                    `}
                  >
                    <ThumbsDown size={14} className="md:w-4 md:h-4" />
                    <span>{videoDislikes.length || 0}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 font-semibold transition-all duration-300 shadow-sm text-xs md:text-sm"
                  >
                    <Share2 size={14} className="md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button
                    className="flex items-center gap-1 px-2 md:px-4 py-1.5 md:py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900 font-semibold transition-all duration-300 shadow-sm text-xs md:text-sm"
                  >
                    <BookmarkPlus size={14} className="md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="p-1.5 md:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MoreVertical size={16} className="md:w-5 md:h-5" />
                    </button>
                    {showMoreOptions && (
                      <div className="absolute right-0 mt-2 w-40 md:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10">
                        <button className="w-full px-3 md:px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm">
                          <Flag size={14} className="md:w-4 md:h-4" />
                          Report
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Channel Info */}
              <div className="mt-4 md:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-0">
                <Link to={`/profile/${video.owner?.username}`} className="flex items-center gap-2 md:gap-3">
                  {video.owner?.avatar && (
                    <img
                      src={video.owner.avatar}
                      alt={video.owner.fullName}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-md"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm md:text-base">
                      {video.owner?.fullName || 'Unknown User'}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {video.owner?.username || ''}
                    </p>
                  </div>
                  <div className='flex items-center gap-1 py-1.5 md:py-2 px-3 md:px-4 bg-green-500 rounded-full shadow-md'>
                    <span className='text-xs md:text-sm text-white'>{subscriberCount} subscribers</span>
                  </div>
                </Link>
                {
                  loggedIn ? (
                    <button
                      onClick={handleSubscribe}
                      disabled={subscriptionLoading}
                      className={`px-4 md:px-6 py-1.5 md:py-2 rounded-xl font-semibold transition-all duration-300 shadow-md text-sm md:text-base
                        ${subscriptionLoading ? 'bg-gray-300 cursor-not-allowed' : ''}
                        ${isSubscribed ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}
                      `}
                    >
                      {subscriptionLoading ? 'Loading...' : (isSubscribed ? 'Unsubscribe' : 'Subscribe')}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 md:px-6 py-1.5 md:py-2 rounded-xl font-semibold transition-all duration-300 shadow-md bg-blue-500 text-white hover:bg-blue-700 text-sm md:text-base"
                    >
                      Login to Subscribe
                    </button>
                  )
                }
              </div>

              {/* Description */}
              <div className="mt-4 md:mt-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-2 text-ellipsis overflow-hidden">
                  {video.description}
                </p>
              </div>

              {/* Comments Section */}
              <div className="mt-6 md:mt-8">
                <Comments videoId={videoId} currentUser={currentUser} loggedIn={loggedIn} />
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-3 md:space-y-4 min-h-screen">
            <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-4 md:p-6 rounded-xl lg:rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 md:w-2 md:h-6 bg-gradient-to-b from-purple-500 to-blue-600 rounded-full" />
                Related Videos
              </h2>
              <div 
                className="related-videos space-y-4 min-hscreen overflow-y-auto pr-2"
                style={{
                  scrollbarWidth: 'none',  /* Firefox */
                  msOverflowStyle: 'none',  /* IE and Edge */
                }}
              >
                <style>
                  {`
                    .related-videos::-webkit-scrollbar {
                      display: none;  /* Chrome, Safari and Opera */
                    }
                  `}
                </style>
                {relatedVideos.map((relatedVideo) => (
                  <Link
                    key={relatedVideo._id}
                    to={`/watch/${relatedVideo._id}`}
                    onClick={handleReletedVideoClick}
                    className="flex gap-2 md:gap-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-32 md:w-40 min-w-[128px] md:min-w-[180px] aspect-video rounded-lg overflow-hidden shadow-md">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                      />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1 py-0.5 rounded text-xs font-medium tracking-wide">
                        {formatDuration(relatedVideo.duration)}
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relatedVideo.title}
                      </h3>

                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          {relatedVideo.owner?.avatar && (
                            <img
                              src={relatedVideo.owner.avatar}
                              alt={relatedVideo.owner.fullName}
                              className="w-3 h-3 md:w-4 md:h-4 rounded-full"
                            />
                          )}
                          <span className="text-xs">{relatedVideo.owner?.fullName || 'Unknown'}</span>
                        </div>
                        <div className="flex gap-1 items-center mt-0.5 text-xs">
                          <span>{relatedVideo.views} views</span>
                          <span>•</span>
                          <span>{formatDate(relatedVideo.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Loading Indicator */}
                {loadingMore && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-blue-500 animate-spin" />
                  </div>
                )}

                {/* No More Videos Message */}
                {!hasMore && relatedVideos.length > 0 && (
                  <div className="text-center py-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    No more videos to load
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayVideo; 