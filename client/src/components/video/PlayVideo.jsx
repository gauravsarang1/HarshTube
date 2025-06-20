import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link ,useLocation} from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, Play, Pause, MessageCircle, Share2, Clock, Eye, MoreVertical, ThumbsDown, Flag, BookmarkPlus, ChevronLeft, ChevronRight, Loader2, Minimize2 } from 'lucide-react';
import Comments from '../comments/Comments';
import { useDispatch, useSelector } from 'react-redux';
import { setIsActive, setCurrentTime, setVideoSrc, setVideoId } from '../../features/body/miniPlayerSlice';

const PlayVideo = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentTime, isActive } = useSelector(state => state.miniPlayer);
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
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [reactionType, setReactionType] = useState('like');
  const [videoLikes, setVideoLikes] = useState([]);
  const [videoDislikes, setVideoDislikes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [totalSubscribers, setTotalSubscribers] = useState([]);
  const [totalSubscribersCount, setTotalSubscribersCount] = useState(0);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  
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
      // First try to use currentTime from Redux
      if (currentTime) {
        videoRef.current.currentTime = currentTime;
      }
      if(!isActive){
        videoRef.current.play();
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if(videoEnded && relatedVideos.length > 0){
      setIsPlaying(false);
      videoRef.current?.pause();
      setTimeout(() => {
        const nextVideoId = relatedVideos[0]._id;
        navigate(`/watch/${nextVideoId}`);
      }, 2000);
      setVideoEnded(false); // Reset the flag
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
      setError(null);

      if (token && videoData?.owner?._id) {
        // Fetch subscribers after video data is set
        const subscribersResponse = await axios.get(
          `${API_BASE_URL}/subscription/get/user/subscribers/${videoData.owner._id}`,
          { headers }
        );

        const data = subscribersResponse?.data?.data;
        const subscribers = data?.channel || [];
        const tSubscribers = data?.totalSubscribers || 0;
        const isSubscribed = data?.isSubscribed || false;
        
        setTotalSubscribers(subscribers);
        if(isSubscribed && tSubscribers === 0) {
          setTotalSubscribersCount(1);
        } else {
          setTotalSubscribersCount(tSubscribers);
        }
        setIsSubscribed(isSubscribed);
      }
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
    if (loggedIn) {
      getAllReactions();
    }
  }, [videoId, fetchRelatedVideos, loggedIn]);

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

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Set initial state
    setIsPlaying(video.paused);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef.current]);

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

      // Make API call first
      const response = await axios.post(
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
    try {
      setIsSubscribing(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/subscription/toggle/sub/${video.owner._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      //console.log(currentUser.id);
      const subscriberId = response?.data?.data?.subscriber;

      if(currentUser.id.includes(subscriberId)){
        setIsSubscribed(true);
      }else{
        //setSubscriber('');
        setIsSubscribed(false);
      }
      console.log( 'response', response.data.data);

    } catch (err) {
      console.error('Error subscribing:', err);
      //setSubscriber('');
    } finally {
      setIsSubscribing(false);
    }
  };

  const openMiniPlayer = (videoSrc) => {
    if (videoRef.current) {
      const currentVideoTime = videoRef.current.currentTime;
      dispatch(setVideoSrc(videoSrc));
      dispatch(setIsActive(true));
      videoRef.current.pause();
      dispatch(setCurrentTime(currentVideoTime));
      dispatch(setVideoId(videoId));
    }
  };


  const addToWatchHistory = async (videoId) => {
    if (!loggedIn) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.post(`${API_BASE_URL}/users/watch-history/add/${videoId}`, {}, {
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
    if(videoId){
      addToWatchHistory(videoId);
    }
  }, [videoId]);

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
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video group relative rounded-xl lg:rounded-2xl overflow-hidden bg-black shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <video
                ref={videoRef}
                src={video.filePath}
                controls
                className="w-full h-full main-video"
                poster={video.thumbnail}
                autoPlay={isPlaying}
                disablePictureInPicture={true}
                onEnded={() => setVideoEnded(true)}
              />
              <button
                onClick={() => openMiniPlayer(video.filePath)}
                className="absolute top-2 right-2 p-1.5 md:p-2 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Minimize2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </button>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <button
                  type="button"
                  className="group/button relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-black/70 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out shadow-2xl border border-white/20 hover:bg-black/80 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/30"
                  tabIndex={0}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  onClick={togglePlayPause}
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
                
                {/* Background blur overlay for better contrast */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
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
                    <span>{video.views} views</span>
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
                    <span className='text-xs md:text-sm text-white'>{totalSubscribersCount} subscribers</span>
                  </div>
                </Link>
                {
                  loggedIn?(
                    <button
                      onClick={handleSubscribe}
                      className={`px-4 md:px-6 py-1.5 md:py-2 rounded-xl font-semibold transition-all duration-300 shadow-md text-sm md:text-base
                        ${isSubscribing ? 'bg-gray-300 cursor-not-allowed' : ''}
                        ${isSubscribed ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}
                      `}
                    >
                      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                  ):(
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 md:px-6 py-1.5 md:py-2 rounded-xl font-semibold transition-all duration-300 shadow-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm md:text-base"
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
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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