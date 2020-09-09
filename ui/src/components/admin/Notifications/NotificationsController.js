import React, { useContext, useState } from 'react';

import NOTIFICATION_TYPES from './NotificationTypes';

export const NotificationsContext = React.createContext();

const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [importNotifications, setImportNotifications] = useState([]);

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
        importNotifications,
        setImportNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useGenomicVariantImportNotifications = () => {
  const {
    appendNotification,
    clearNotification,
    importNotifications,
    setImportNotifications,
  } = useContext(NotificationsContext);

  const getImportNotifications = () => {
    if (!importNotifications) return [];
    return importNotifications;
  };

  const addImportNotification = async modelName => {
    const existingNotification = getImportNotifications().find(x => x.modelName === modelName);

    if (!existingNotification) {
      const notification = await appendNotification({
        type: NOTIFICATION_TYPES.LOADING,
        message: `Importing: Research Variants for ${modelName} are currently importing.`,
        details:
          'You can continue to use the CMS, and will be notified when the import is complete.',
        timeout: false,
      });

      setImportNotifications(notifications => [
        ...notifications,
        {
          modelName: modelName,
          notificationId: notification.id,
        },
      ]);
    }
  };

  const removeImportNotification = modelName => {
    const existingNotification = getImportNotifications().find(x => x.modelName === modelName);

    if (existingNotification) {
      clearNotification(existingNotification.notificationId);
      setImportNotifications(notifications =>
        notifications.filter(notification => notification.modelName !== modelName),
      );
    }
  };

  const showSuccessfulImportNotification = modelName => {
    appendNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message: `Import Successful: Research Somatic Variants for ${modelName} have successfully imported, however are not yet published.`,
      link: `/admin/model/${modelName}`,
      linkText: 'View on model page to publish these variants.',
    });
  };

  return {
    importNotifications: getImportNotifications(),
    setImportNotifications,
    addImportNotification,
    removeImportNotification,
    showSuccessfulImportNotification,
  };
};

export default NotificationsProvider;
