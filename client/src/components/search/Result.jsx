import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ResultUsers from './ResultUsers';
import ResultVideos from './ResultVideos';
import ResultPlaylists from './ResultPlaylists';

const Result = () => {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (!query) return;
    const token = localStorage.getItem('token');
    if(!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      axios.get(`/api/v1/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      axios.get(`/api/v1/videos/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      axios.get(`/api/v1/playlist/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    ])
      .then(([usersRes, videosRes, playlistsRes]) => {
        setUsers(usersRes.data.data || []);
        setVideos(videosRes.data.data || []);
        setPlaylists(playlistsRes.data.data || []);
      })
      .catch(() => setError('Failed to fetch search results.'))
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 py-8 border-2 border-blue-200 dark:border-blue-800 text-center">
          <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">Enter a search query.</div>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 py-8 border-2 border-blue-200 dark:border-blue-800 text-center animate-pulse">
          <div className="text-xl font-semibold text-blue-500 dark:text-blue-400">Loading...</div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 py-8 border-2 border-red-200 dark:border-red-800 text-center">
          <div className="text-xl font-semibold text-red-500 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  const hasResults = users.length || videos.length || playlists.length;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 pt-8">
      {!hasResults && (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl px-8 py-8 border-2 border-gray-200 dark:border-gray-800 text-center">
            <div className="text-xl font-semibold text-gray-500 dark:text-gray-400">No results found.</div>
          </div>
        </div>
      )}
      {users.length > 0 && <ResultUsers users={users} />}
      {videos.length > 0 && <ResultVideos videos={videos} />}
      {playlists.length > 0 && <ResultPlaylists playlists={playlists} />}
    </div>
  );
};

export default Result;