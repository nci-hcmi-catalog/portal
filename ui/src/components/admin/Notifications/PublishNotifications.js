import React, { useContext } from 'react';
import { NotificationsContext } from './NotificationsController';
import NOTIFICATION_TYPES from './NotificationTypes';
import {
  acknowledgePublishStatus,
  checkPublishStatus,
} from 'components/admin/Model/actions/Publish';
import { PUBLISH_ERRORS, PUBLISH_TYPES } from 'utils/constants';

export const PublishNotificationsContext = React.createContext([{}, () => {}]);

export const PublishNotificationsProvider = ({ children }) => {
  const {
    notifications,
    appendNotification,
    clearNotification,
    publishNotifications,
    setPublishNotifications,
    publishProgress,
    setPublishProgress,
  } = useContext(NotificationsContext);

  // ONLY USED FOR INDIVIDUAL PUBLISHES
  const getPublishNotifications = () => {
    if (!publishNotifications) return [];
    return publishNotifications;
  };

  const isPublishingModel = modelName => {
    return getPublishNotifications().find(activePublish => activePublish.modelName === modelName) ||
      (publishProgress.running &&
        publishProgress.queue.find(queuedPublish => queuedPublish.modelName === modelName))
      ? true
      : false;
  };

  // ONLY USED FOR INDIVIDUAL PUBLISHES
  const addPublishNotification = async modelName => {
    const existingNotification = getPublishNotifications().find(x => x.modelName === modelName);

    if (existingNotification) {
      existingNotification.clear();
    }

    const notification = await appendNotification({
      type: NOTIFICATION_TYPES.LOADING,
      message: `Publishing: ${modelName}`,
      details:
        'You can continue to use the CMS and will be notified when the publish is complete. Please note that some functions are unavailable during the publish process.',
      timeout: false,
    });

    setPublishNotifications(notifications => [
      ...notifications.filter(notification => notification.modelName !== modelName),
      {
        modelName: modelName,
        notificationId: notification.id,
        clear: notification.clear,
      },
    ]);
  };

  // ONLY USED FOR INDIVIDUAL PUBLISHES
  const removePublishNotification = modelName => {
    const existingNotification = getPublishNotifications().find(x => x.modelName === modelName);

    if (existingNotification) {
      clearNotification(existingNotification.notificationId);
      setPublishNotifications(notifications =>
        notifications.filter(notification => notification.modelName !== modelName),
      );
    }
  };

  // ONLY USED FOR INDIVIDUAL PUBLISHES
  const showSuccessfulPublishNotification = modelName => {
    if (notifications.find(x => x.modelName === modelName)) {
      return;
    }

    appendNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message: 'Publish Successful!',
      details: `${modelName} has been successfully published. View it live here: `,
      link: `/model/${modelName}`,
      linkText: modelName,
      timeout: false,
      modelName,
      onClose: () => {
        acknowledgeModelAndUpdateNotifications(modelName);
      },
    });
  };

  // ONLY USED FOR INDIVIDUAL PUBLISHES
  const showStoppedPublishNotification = modelName => {
    if (notifications.find(x => x.modelName === modelName)) {
      return;
    }

    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message: `Publish Stopped: ${modelName} has not been published.`,
      link: `/admin/model/${modelName}`,
      linkText: 'View on model page to restart the publish.',
      timeout: false,
      modelName,
      onClose: () => {
        acknowledgeModelAndUpdateNotifications(modelName);
      },
    });
  };

  const showErrorPublishNotification = (modelName, error) => {
    if (notifications.find(x => x.modelName === modelName)) {
      return;
    }

    switch (error.error && error.error.code) {
      case PUBLISH_ERRORS.noMatchingModel:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Publish Error: Model Not Found',
          details: `The model ${modelName} was not found in the HCMI database.`,
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
        });
        break;
      case PUBLISH_ERRORS.badRequest:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Publish Error: Bad Request',
          details: `The publish request for ${modelName} was not formed correctly: ${
            error.message
          }`,
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
        });
        break;
      case PUBLISH_ERRORS.validationErrror:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: `Publish Error: Validation Failed for ${modelName}`,
          details: error.message,
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
        });
        break;
      case PUBLISH_ERRORS.unexpected:
      default:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: `Publish Error: An unexpected error occured while publishing ${modelName}`,
          details: error.message,
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
        });
        break;
    }
  };

  // Remove a model's error notification without triggering onClose function
  const hideErrorPublishNotification = modelName => {
    const existingNotification = notifications.find(x => x.modelName === modelName);

    if (existingNotification) {
      existingNotification.clear();
    }
  };

  const showUnexpectedPublishError = error => {
    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message: 'Publish Error: An unexpected error has occurred.',
      details: error.message || error.details || error.name,
      timeout: false,
    });
  };

  const updatePublishNotificationsFromStatus = async () => {
    const { queue, stopped, success, failed } = publishProgress;

    // Add publish notifications for individual publishes in the queue
    const individualQueuedPublishes = (queue || []).filter(
      x => x.publishType === PUBLISH_TYPES.individual,
    );
    individualQueuedPublishes.forEach(publishTask => {
      const modelName = publishTask.modelName;
      if (!getPublishNotifications().find(x => x.modelName === modelName)) {
        addPublishNotification(modelName);
      }
    });

    // Remove publish notification and show stopped notification for stopped individual publishes
    const individualStoppedPublishes = (stopped || []).filter(
      x => x.publishType === PUBLISH_TYPES.individual,
    );
    individualStoppedPublishes.forEach(stoppedPublish => {
      const modelName = stoppedPublish.modelName;
      removePublishNotification(modelName);
      showStoppedPublishNotification(modelName);
    });

    // Remove publish notification and show success notification for completed individual publishes
    const individualCompletedPublishes = (success || []).filter(
      x => x.publishType === PUBLISH_TYPES.individual,
    );
    individualCompletedPublishes.forEach(completedPublish => {
      const modelName = completedPublish.modelName;
      removePublishNotification(modelName);
      showSuccessfulPublishNotification(modelName);
    });

    // Remove publish errors for re-queued bulk publishes (re-published)
    const bulkQueuedPublishes = (queue || []).filter(x => x.publishType === PUBLISH_TYPES.bulk);
    bulkQueuedPublishes.forEach(queuedPublish => {
      const modelName = queuedPublish.modelName;
      hideErrorPublishNotification(modelName);
    });

    // Remove publish errors for completed bulk publishes
    const bulkCompletedPublishes = (success || []).filter(
      x => x.publishType === PUBLISH_TYPES.bulk,
    );
    bulkCompletedPublishes.forEach(completedPublish => {
      const modelName = completedPublish.modelName;
      hideErrorPublishNotification(modelName);
    });

    // Add error notifications for failed publishes
    const failedPublishes = failed || [];

    failedPublishes.forEach(failedPublish => {
      const modelName = failedPublish.modelName;

      if (failedPublish.publishType === PUBLISH_TYPES.individual) {
        removePublishNotification(modelName);
      }

      if (failedPublish.actionable || failedPublish.publishType === PUBLISH_TYPES.individual) {
        // Actionable errors and errors for individual publishes get shown normally
        showErrorPublishNotification(modelName, failedPublish);
      }
    });
  };

  const fetchPublishStatus = async () => {
    await checkPublishStatus()
      .then(publishStatus => {
        setPublishProgress(publishStatus);
      })
      .catch(error => {
        showUnexpectedPublishError(error);
      });
  };

  const acknowledgeModelAndUpdateNotifications = async modelName => {
    await acknowledgePublishStatus(modelName)
      .then(async _ => {
        await fetchPublishStatus();
      })
      .catch(error => {
        showUnexpectedPublishError(error);
      });
  };

  return (
    <PublishNotificationsContext.Provider
      value={{
        publishNotifications: getPublishNotifications(),
        addPublishNotification,
        showErrorPublishNotification,
        showUnexpectedPublishError,
        updatePublishNotificationsFromStatus,
        fetchPublishStatus,
        hideErrorPublishNotification,
        publishRunning: publishProgress.running,
        isPublishingModel,
      }}
    >
      {children}
    </PublishNotificationsContext.Provider>
  );
};

const usePublishNotifications = () => {
  const {
    publishNotifications,
    addPublishNotification,
    showErrorPublishNotification,
    showUnexpectedPublishError,
    updatePublishNotificationsFromStatus,
    fetchPublishStatus,
    hideErrorPublishNotification,
    publishRunning,
    isPublishingModel,
  } = useContext(PublishNotificationsContext);

  return {
    publishNotifications,
    addPublishNotification,
    showErrorPublishNotification,
    showUnexpectedPublishError,
    updatePublishNotificationsFromStatus,
    fetchPublishStatus,
    hideErrorPublishNotification,
    publishRunning,
    isPublishingModel,
  };
};

export default usePublishNotifications;
