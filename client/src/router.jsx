import { createBrowserRouter } from 'react-router-dom';
import AppContent from './AppContent'; // move the current AppContent logic here

export const router = createBrowserRouter([
  {
    path: '*',
    element: <AppContent />
  }
]);
