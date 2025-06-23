import { useState, useEffect } from 'react';
import { userApi } from '../components/profile/utils/api';
import { showError, showSuccess } from '../utils/toast';

export const useUserProfile = (username) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      try {
        setIsLoading(true);
        const response = await userApi.getProfile(username);
        setUser(response.data.data);
        setFullName(response.data.data.fullName);
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
        showError(err.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  return { user, isLoading, error, fullName, setFullName };
}; 