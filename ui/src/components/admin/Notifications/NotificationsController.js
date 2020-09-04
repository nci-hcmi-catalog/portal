import React, { useState } from 'react';

export const NotificationsContext = React.createContext();

const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [importNotification, setImportNotification] = useState(null);

  const appendNotification = notification => {
    const id = Date.now();
    // default value is 10 seconds, can be overwritten or turned off (false)
    const timeout = 'timeout' in notification ? notification.timeout : 10000;

    const clear = () => {
      // removes the notification from notifications
      setNotifications(notifications => [
        ...notifications.filter(notification => notification.id !== id),
      ]);

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
        importNotification,
        setImportNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
