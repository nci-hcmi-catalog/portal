import React, { useState } from 'react';
import uuid from 'uuid/v4';

import {
  DEFAULT_IMPORT_PROGRESS,
  DEFAULT_NONACTIONABLE_IMPORTS,
 } from 'utils/constants';

export const NotificationsContext = React.createContext();

const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  // only used for imports initiated from individual model pages
  const [importNotifications, setImportNotifications] = useState([]);
  // bulk variant import progress
  const [importProgress, setImportProgress] = useState(DEFAULT_IMPORT_PROGRESS);
  // models which failed variant import with nonactionable errors
  const [nonactionableImports, setNonactionableImports] = useState(DEFAULT_NONACTIONABLE_IMPORTS);

  const appendNotification = notification => {
    const id = uuid();
    // default value is 10 seconds, can be overwritten or turned off (false)
    const timeout = 'timeout' in notification ? notification.timeout : 10000;

    const clear = (useCallback = false) => {
      // removes the notification from notifications
      setNotifications(notifications => [
        ...notifications.filter(notification => notification.id !== id),
      ]);

      // run optional onClose callback
      // default is to NOT run the callback, must pass bool `true` to run
      if (useCallback && notification.onClose) {
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

  // called when clicking the 'x' on a notification, ALWAYS runs onClose callback
  const clearNotification = id => {
    notifications.find(notification => notification.id === id).clear(true);
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
