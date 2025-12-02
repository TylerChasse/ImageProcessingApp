/**
 * useErrorNotification Hook
 *
 * Custom hook for managing error notifications throughout the app.
 * Must be used within an ErrorNotificationProvider.
 */

import { createContext, useContext } from 'react';

export const ErrorNotificationContext = createContext();

export const useErrorNotification = () => {
  const context = useContext(ErrorNotificationContext);
  if (!context) {
    throw new Error('useErrorNotification must be used within ErrorNotificationProvider');
  }
  return context;

};
