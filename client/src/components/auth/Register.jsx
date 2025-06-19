import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Upload, X } from 'lucide-react';

const Register = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') {
          setAvatarPreview(reader.result);
          setSelectedAvatar(file);
        } else {
          setCoverPreview(reader.result);
          setSelectedCover(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    if (type === 'avatar') {
      setAvatarPreview(null);
      setSelectedAvatar(null);
    } else {
      setCoverPreview(null);
      setSelectedCover(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('fullName', data.fullName);

      // Append avatar if exists
      if (selectedAvatar) {
        formData.append('avatar', selectedAvatar);
      }

      // Append cover image if exists
      if (selectedCover) {
        formData.append('coverImage', selectedCover);
      }

      const response = await axios.post('http://localhost:5050/api/v1/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</span>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            Join us and start sharing your videos
          </p>
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="text-red-500 text-sm font-semibold bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2 border border-red-200 dark:border-red-700 shadow-sm flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-4">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Profile Picture (Required)
                </label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="relative">
                    {avatarPreview ? (
                      <div className="relative w-20 h-20">
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage('avatar')}
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full p-1 hover:scale-110 shadow-md transition-all duration-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Upload size={24} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'avatar')}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Upload size={16} className="mr-2" />
                      Upload Avatar
                    </label>
                    {!selectedAvatar && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">Profile picture is required</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Cover Image (Optional)
                </label>
                <div className="mt-1">
                  {coverPreview ? (
                    <div className="relative">
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-32 object-cover rounded-xl shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('cover')}
                        className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full p-1 hover:scale-110 shadow-md transition-all duration-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Upload size={24} className="text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'cover')}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors mt-2"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Cover
                  </label>
                </div>
              </div>
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  {...register('fullName', { required: 'Full name is required' })}
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
                )}
              </div>
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  {...register('username', { required: 'Username is required' })}
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username.message}</p>
                )}
              </div>
              {/* Email */}
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
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required' })}
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
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 