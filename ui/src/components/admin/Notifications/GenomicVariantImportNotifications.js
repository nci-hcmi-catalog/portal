import { useContext } from 'react';

import { NotificationsContext } from './NotificationsController';
import NOTIFICATION_TYPES from './NotificationTypes';

const useGenomicVariantImportNotifications = () => {
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

export default useGenomicVariantImportNotifications;
