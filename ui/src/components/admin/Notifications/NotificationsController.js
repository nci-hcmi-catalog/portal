import React, { useState } from 'react';
import { GDC_MODEL_STATES } from 'utils/constants';

export const NotificationsContext = React.createContext();

const DEFAULT_IMPORT_PROGRESS = {
  queue: [],
  failed: [],
  stopped: [],
  success: [],
  running: false,
};

const DEFAULT_NONACTIONABLE_IMPORTS = {
  [GDC_MODEL_STATES.modelNotFound]: [],
  [GDC_MODEL_STATES.noMafs]: [],
};

const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  // only used for imports initiated from individual model pages
  const [importNotifications, setImportNotifications] = useState([]);
  // bulk variant import progress
  const [importProgress, setImportProgress] = useState(DEFAULT_IMPORT_PROGRESS);
  // models which failed variant import with nonactionable errors
  const [nonactionableImports, setNonactionableImports] = useState(DEFAULT_NONACTIONABLE_IMPORTS);

  const appendNotification = notification => {
    const id = Date.now();
    // default value is 10 seconds, can be overwritten or turned off (false)
    const timeout = 'timeout' in notification ? notification.timeout : 10000;

    const clear = () => {
      // removes the notification from notifications
      setNotifications(notifications => [
        ...notifications.filter(notification => notification.id !== id),
      ]);

      // run optional onClose function
      if (notification.onClose) {
        notification.onClose();
      }

      // clears the timout function
      window.clearTimeout(notificationTimeout);
    };

    // if the notification has a timeout (default)
    // on timeout will clear the notification
    const notificationTimeout =
      timeout &&
      setTimeout(() => {
        clear();
      }, timeout);

    const notificationObj = {
      ...notification,
      id,
      clear,
    };

    setNotifications(notifications => [...notifications, notificationObj]);

    return notificationObj;
  };

  const clearNotification = id => {
    notifications.find(notification => notification.id === id).clear();
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        appendNotification,
        clearNotification,
        importNotifications,
        setImportNotifications,
        importProgress,
        setImportProgress,
        nonactionableImports,
        setNonactionableImports,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
