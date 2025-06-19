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
    return <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-xl font-semibold">Enter a search query.</div>;
  }
  if (loading) {
    return <div className="text-center py-16 text-blue-500 text-xl font-semibold">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-16 text-red-500 text-xl font-semibold">{error}</div>;
  }

  const hasResults = users.length || videos.length || playlists.length;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {!hasResults && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-xl font-semibold">
          No results found.
        </div>
      )}
      {users.length > 0 && <ResultUsers users={users} />}
      {videos.length > 0 && <ResultVideos videos={videos} />}
      {playlists.length > 0 && <ResultPlaylists playlists={playlists} />}
    </div>
  );
};

export default Result;