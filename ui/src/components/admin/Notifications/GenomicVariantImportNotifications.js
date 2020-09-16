import React, { useContext } from 'react';

import {
  GENOMIC_VARIANTS_IMPORT_ERRORS,
  MultipleMafError,
  NoMafError,
} from '../Model/actions/GenomicVariants';
import { acknowledgeImportStatus } from 'components/admin/Model/actions/GenomicVariants';
import { VARIANT_IMPORT_STATUS } from 'utils/constants';
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

  const showErrorImportNotification = (modelName, error) => {
    if (error) {
      switch (error.code) {
        case GENOMIC_VARIANTS_IMPORT_ERRORS.multipleMaf:
          appendNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: `Import Error: More than one MAF file was found in GDC for ${modelName}.`,
            details: <MultipleMafError files={error.files} />,
            timeout: false,
          });
          break;
        case GENOMIC_VARIANTS_IMPORT_ERRORS.noMaf:
          appendNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: `Import Error: No MAF files found in GDC.`,
            details: <NoMafError caseId={error.case_id} modelName={modelName} />,
            timeout: false,
          });
          break;
        case GENOMIC_VARIANTS_IMPORT_ERRORS.modelNotFound:
          appendNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: `Import Error: The model, ${modelName}, was not found in GDC.`,
            timeout: false,
          });
          break;
        default:
          appendNotification({
            type: NOTIFICATION_TYPES.ERROR,
            message: `Import Error: An unexpected error occured while importing research variants for ${modelName}`,
            details: error.message,
            timeout: false,
          });
          break;
      }
    } else {
      appendNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: `Import Error: An unexpected error occured while importing research variants for ${modelName}.`,
        details: '',
        timeout: false,
      });
    }
    acknowledgeImportStatus(modelName);
  };

  const updateNotificationsFromStatus = imports => {
    if (imports.length > 0) {
      imports.forEach(importItem => {
        switch (importItem.status) {
          case VARIANT_IMPORT_STATUS.complete:
            acknowledgeImportStatus(importItem.name).then(_ => {
              removeImportNotification(importItem.name);
              showSuccessfulImportNotification(importItem.name);
            });
            break;
          case VARIANT_IMPORT_STATUS.error:
            acknowledgeImportStatus(importItem.name).then(_ => {
              removeImportNotification(importItem.name);
              showErrorImportNotification(importItem.name, importItem.error);
            });
            break;
          default:
            // Stopped or Active imports require no actions
            break;
        }
      });
    }
  };

  return {
    importNotifications: getImportNotifications(),
    setImportNotifications,
    addImportNotification,
    removeImportNotification,
    showSuccessfulImportNotification,
    showErrorImportNotification,
    updateNotificationsFromStatus,
  };
};

export default useGenomicVariantImportNotifications;
