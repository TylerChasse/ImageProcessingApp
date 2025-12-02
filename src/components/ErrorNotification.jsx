/**
 *  Notification Notification Component
 *
 * Displays temporary notifications for errors.
 */

import { useState, useCallback } from 'react';
import { ErrorNotificationContext } from '../hooks/useErrorNotification';
import styles from '../styles/ErrorNotification.module.css';

export { useErrorNotification } from '../hooks/useErrorNotification';

export const ErrorNotificationProvider = ({ children }) => {
  const [errorNotifications, setErrorNotifications] = useState([]);

  // Add a new errorNotification
  const addErrorNotification = useCallback((message, type = 'error', duration = 5000) => {
    const id = Date.now();
    setErrorNotifications(prev => [...prev, { id, message, type }]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeErrorNotification(id);
      }, duration);
    }
  }, []);

  // Remove a errorNotification
  const removeErrorNotification = useCallback((id) => {
    setErrorNotifications(prev => prev.filter(errorNotification => errorNotification.id !== id));
  }, []);

  // Convenience methods
  const showError = useCallback((message, duration) => {
    addErrorNotification(message, 'error', duration);
  }, [addErrorNotification]);

  const value = {
    addErrorNotification,
    showError,
  };

  return (
    <ErrorNotificationContext.Provider value={value}>
      {children}
      <div className={styles.errorNotificationContainer}>
        {errorNotifications.map(errorNotification => (
          <div
            key={errorNotification.id}
            className={`${styles.errorNotification} ${styles[errorNotification.type]}`}
            onClick={() => removeErrorNotification(errorNotification.id)}
          >
            <div className={styles.errorNotificationIcon}>
              {errorNotification.type === 'error' && '❌'}
            </div>
            <div className={styles.errorNotificationMessage}>{errorNotification.message}</div>
            <button 
              className={styles.errorNotificationClose}
              onClick={() => removeErrorNotification(errorNotification.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ErrorNotificationContext.Provider>
  );
};