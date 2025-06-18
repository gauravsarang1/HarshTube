import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link ,useLocation} from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, MessageCircle, Share2, Clock, Eye, MoreVertical, ThumbsDown, Flag, BookmarkPlus, ChevronLeft, ChevronRight, Loader2, Minimize2 } from 'lucide-react';
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
  const [totalSubscribers, setTotalSubscribers] = useState([]);
  const [totalSubscribersCount, setTotalSubscribersCount] = useState(0);
  const videoRef = useRef(null);
  
  //const [subscriber, setSubscriber] = useState('');

  // Initialize current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    fetchVideo();
  }, []);

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

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5050/api/v1/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const videoData = response.data.data;
      setVideo(videoData);
      setError(null);

      // Fetch subscribers after video data is set
      if (videoData?.owner?._id) {
        const subscribersResponse = await axios.get(
          `http://localhost:5050/api/v1/subscription/get/user/subscribers/${videoData.owner._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
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
        navigate('/login');
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
      if (!token) {
        throw new Error('Please login to watch videos');
      }

      const response = await axios.get(
        `http://localhost:5050/api/v1/videos/all-videos?page=${page}&limit=${10}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const { videos: videoList, hasMore: more } = response.data.data;
      console.log('hasMore', more);
      
      // Filter out the current video and add new videos
      const filteredVideos = videoList.filter(v => v._id !== videoId);
      const randomVideos = filteredVideos.sort(() => Math.random() - 0.5);
      
      if (page === 1) {
        setRelatedVideos(randomVideos);
      } else {
        // Ensure no duplicate videos are added
        setRelatedVideos(prev => {
          const existingIds = new Set(prev.map(v => v._id));
          const newVideos = filteredVideos.filter(v => !existingIds.has(v._id));
          return [...prev, ...newVideos];
        });
      }
      
      //setTotalPages(pages);
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
  }, [videoId, fetchRelatedVideos]);

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

  const getAllReactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const headers = { Authorization: `Bearer ${token}` };
  
      const [likesRes, dislikesRes] = await Promise.all([
        axios.get(`http://localhost:5050/api/v1/likes/get/video/likes/${videoId}`, { headers }),
        axios.get(`http://localhost:5050/api/v1/likes/get/video/disLikes/${videoId}`, { headers })
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
        navigate('/login');
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
        `http://localhost:5050/api/v1/likes/toggle/v/${videoId}`,
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
        navigate('/login');
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
      console.log( 'video.owner._id', video.owner._id);
      const response = await axios.post(
        `http://localhost:5050/api/v1/subscription/toggle/sub/${video.owner._id}`,
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
    try {
      const token = localStorage.getItem('token');
      if(!token){
        navigate('/login');
        return;
      }

      const response = await axios.post(`http://localhost:5050/api/v1/watch-history/add/${videoId}`,
      {},
      {
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
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-lg"></div>
                <div className="mt-4 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
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
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button
            onClick={fetchVideo}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video group relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                src={video.filePath}
                controls
                className="w-full h-full main-video"
                poster={video.thumbnail}
              />
              <button
                onClick={() => openMiniPlayer(video.filePath)}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Minimize2 className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-xl font-bold text-gray-900 line-clamp-2 text-ellipsis overflow-hidden dark:text-white">
                {video.title}
              </h1>

              {/* Video Stats and Actions */}
              <div className="flex flex-wrap items-center justify-between mt-2 gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{video.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                <button
                    onClick={() => toggleVideoReaction('like')}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full ${
                      liked
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <ThumbsUp size={16} />
                    <span>{videoLikes.length || 0}</span>
                  </button>

                  <button
                    onClick={() => toggleVideoReaction('disLike')}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full ${
                      disliked
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <ThumbsDown size={16} />
                    <span>{videoDislikes.length || 0}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                  <button
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <BookmarkPlus size={16} />
                    <span>Save</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {showMoreOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10">
                        <button className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                          <Flag size={16} />
                          Report
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Channel Info */}
              <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
                <div className="flex items-center gap-3">
                  {video.owner?.avatar && (
                    <img
                      src={video.owner.avatar}
                      alt={video.owner.fullName}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {video.owner?.fullName || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {video.owner?.username || ''}
                    </p>
                  </div>
                  <div className='flex items-center gap-1 py-2 px-4 bg-green-500 rounded-full'>
                    <span className='text-md text-white'>{totalSubscribersCount} subscribers</span>
                  </div>
                </div>
                <button
                  onClick={handleSubscribe}
                  className={`${isSubscribing ? 'bg-gray-300 cursor-not-allowed' : ''} ${isSubscribed ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'} px-4 py-2 rounded-full w-full md:w-auto`}>
                  {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </button>
              </div>

              {/* Description */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-2 text-ellipsis overflow-hidden">
                  {video.description}
                </p>
              </div>

              {/* Comments Section */}
              <Comments videoId={videoId} />
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-4 min-h-screen">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
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
                  className="flex gap-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-40 min-w-[180px] aspect-video rounded-lg overflow-hidden">
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
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {relatedVideo.title}
                    </h3>

                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <div className="flex items-center gap-1">
                        {relatedVideo.owner?.avatar && (
                          <img
                            src={relatedVideo.owner.avatar}
                            alt={relatedVideo.owner.fullName}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        <span>{relatedVideo.owner?.fullName || 'Unknown'}</span>
                      </div>
                      <div className="flex gap-1 items-center mt-0.5">
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
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              )}

              {/* No More Videos Message */}
              {!hasMore && relatedVideos.length > 0 && (
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  No more videos to load
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayVideo; 