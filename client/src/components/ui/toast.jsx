import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        className: '',
        duration: 4000,
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        // Success toast
        success: {
          duration: 4000,
          style: {
            background: 'rgba(34, 197, 94, 0.95)',
            color: 'white',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#22c55e',
          },
        },
        // Error toast
        error: {
          duration: 5000,
          style: {
            background: 'rgba(239, 68, 68, 0.95)',
            color: 'white',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#ef4444',
          },
        },
        // Warning toast
        warning: {
          duration: 4000,
          style: {
            background: 'rgba(245, 158, 11, 0.95)',
            color: 'white',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#f59e0b',
          },
        },
        // Info toast
        info: {
          duration: 4000,
          style: {
            background: 'rgba(59, 130, 246, 0.95)',
            color: 'white',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#3b82f6',
          },
        },
      }}
    />
  );
};

export default Toast; 