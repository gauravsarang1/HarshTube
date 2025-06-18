export const getAuthToken = () => localStorage.getItem('token');

export const handleAuthError = (navigate) => {
  const token = getAuthToken();
  if (!token) {
    navigate('/login');
    return false;
  }
  return true;
}; 