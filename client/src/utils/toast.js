import toast from 'react-hot-toast';

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    id: message, // Prevents duplicate toasts
  });
};

// Error toast
export const showError = (message) => {
  toast.error(message, {
    id: message, // Prevents duplicate toasts
  });
};

// Warning toast
export const showWarning = (message) => {
  toast(message, {
    icon: '⚠️',
    style: {
      background: 'rgba(245, 158, 11, 0.95)',
      color: 'white',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#f59e0b',
    },
    id: message,
  });
};

// Info toast
export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      background: 'rgba(59, 130, 246, 0.95)',
      color: 'white',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#3b82f6',
    },
    id: message,
  });
};

// Loading toast
export const showLoading = (message = 'Loading...') => {
  return toast.loading(message, {
    style: {
      background: 'rgba(107, 114, 128, 0.95)',
      color: 'white',
      border: '1px solid rgba(107, 114, 128, 0.3)',
    },
  });
};

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Custom toast with icon
export const showCustomToast = (message, icon, style = {}) => {
  toast(message, {
    icon,
    style: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      ...style,
    },
    id: message,
  });
};

// Promise toast - automatically shows loading, success, or error
export const showPromiseToast = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong!',
    },
    {
      style: {
        minWidth: '250px',
      },
    }
  );
}; 