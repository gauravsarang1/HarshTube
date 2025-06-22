import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/api/v1';

const Login = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await axios.post(`${API_BASE_URL}/users/login`, data);
      if (response.data?.data?.accessToken && response.data?.data?.refreshToken && response.data?.data?.loggedInUser) {
       const {_id, username, fullName, email, coverImage, avatar, createdAt, updatedAt} = response.data.data.loggedInUser
       const user = {
        id: _id,
        username,
        fullName,
        email,
        coverImage,
        avatar,
        createdAt,
        updatedAt
       }
       showSuccess('Login successful');
       
       // Use global auth state update function if available
       if (window.updateAuthState) {
         window.updateAuthState(response.data.data.accessToken, user);
       } else {
         localStorage.setItem('token', response.data.data.accessToken);
         localStorage.setItem('user', JSON.stringify(user));
       }
       
        navigate('/home');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-950/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/80 p-10 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-8 bg-gradient-to-b from-red-500 to-pink-600 rounded-full" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Sign In</span>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            Sign in to your account to continue
          </p>
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2 border border-red-200 dark:border-red-700 shadow-sm flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required'
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 hover:shadow-xl'}
              `}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 