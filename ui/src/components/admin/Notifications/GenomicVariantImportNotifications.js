import React, { useContext } from 'react';

import { NotificationsContext } from './NotificationsController';

import {
  acknowledgeImportStatus,
  acknowledgeBulkImportStatus,
} from 'components/admin/Model/actions/GenomicVariants';
import withConfirmMafFileModal from 'components/modals/ConfirmMafFileModal';

import NOTIFICATION_TYPES from './NotificationTypes';
import { GDC_MODEL_STATES, GENOMIC_VARIANTS_IMPORT_ERRORS } from 'utils/constants';

import { ButtonPill } from 'theme/adminControlsStyles';
import { NotificationTableHeaderRow, NotificationTableHeaderCol } from 'theme/adminNotificationStyles';
import { Row } from 'theme/system';

const getImportErrorMessage = error => {
  switch (error) {
    case GDC_MODEL_STATES.singleNgcmPlusEngcm:
      return 'other unexpected MAF files were found.';
    case GDC_MODEL_STATES.noNgcm:
      return 'only Expanded Next Generation Cancer Model MAF file(s) were found.';
    case GDC_MODEL_STATES.multipleNgcm:
      return 'more than one Next Generation Cancer Model MAF files were found.';
    default:
      return 'there was an error';
  }
}

const ConfirmMafFileError = ({ modelName, tissueStatus, files, error, onConfirm }) => {
  return (
    <>
      {modelName} was found in GDC, but <strong>{getImportErrorMessage(error)}</strong> Please investigate:
      {withConfirmMafFileModal({
        modelName,
        tissueStatus,
        files,
        onConfirm,
      })(<ButtonPill
        secondary
        marginLeft="12px"
        style={{
          display: 'inline-flex',
          verticalAlign: 'bottom'
        }}
      >
        Confirm MAF File
      </ButtonPill>)}
    </>
  );
};

const BulkNonActionableImportErrors = ({ modelNotFound = [], noMafs = [] }) => {
  return (
    <>
      <NotificationTableHeaderRow>
        <NotificationTableHeaderCol>
          <strong>Model(s) not found in GDC ({modelNotFound.length})</strong>
        </NotificationTableHeaderCol>
        <NotificationTableHeaderCol>
          <strong>Model(s) found in GDC but no MAF files were found ({noMafs.length})</strong>
        </NotificationTableHeaderCol>
      </NotificationTableHeaderRow>
      <Row>
        <NotificationTableHeaderCol>
          {modelNotFound.map((modelName, i) => i < modelNotFound.length - 1 ? `${modelName}, ` : modelName)}
        </NotificationTableHeaderCol>
        <NotificationTableHeaderCol>
          {noMafs.map((modelName, i) => i < noMafs.length - 1 ? `${modelName}, ` : modelName)}
        </NotificationTableHeaderCol>
      </Row>
    </>
  );
};

const useGenomicVariantImportNotifications = () => {
  const {
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
  } = useContext(NotificationsContext);

  // ONLY USED FOR INDIVIDUAL IMPORTS
  const getImportNotifications = () => {
    if (!importNotifications) return [];
    return importNotifications;
  };

  // ONLY USED FOR INDIVIDUAL IMPORTS
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

  // ONLY USED FOR INDIVIDUAL IMPORTS
  const removeImportNotification = modelName => {
    const existingNotification = getImportNotifications().find(x => x.modelName === modelName);

    if (existingNotification) {
      clearNotification(existingNotification.notificationId);
      setImportNotifications(notifications =>
        notifications.filter(notification => notification.modelName !== modelName),
      );
    }
  };

  // ONLY USED FOR INDIVIDUAL IMPORTS
  const showSuccessfulImportNotification = modelName => {
    if (notifications.find(x => x.modelName === modelName)) {
      return;
    }

    appendNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message: `Import Successful: Research Somatic Variants for ${modelName} have successfully imported, however are not yet published.`,
      link: `/admin/model/${modelName}`,
      linkText: 'View on model page to publish these variants.',
      timeout: false,
      modelName,
      onClose: () => { acknowledgeImportStatus(modelName) },
    });
  };

  // ONLY USED FOR INDIVIDUAL IMPORTS
  const showStoppedImportNotification = modelName => {
    if (notifications.find(x => x.modelName === modelName)) {
      return;
    }

    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message: `Import Stopped: Research Somatic Variants for ${modelName} have not been imported.`,
      link: `/admin/model/${modelName}`,
      linkText: 'View on model page to restart the import for these variants.',
      timeout: false,
      modelName,
      onClose: () => { acknowledgeImportStatus(modelName) },
});
  };

  const showErrorImportNotification = (modelName, error) => {
    if (notifications.find(x => x.modelName === modelName)) {
      return;
    }

    switch (error.error && error.error.code) {
      case GDC_MODEL_STATES.singleNgcmPlusEngcm:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Import Error with Action Required.',
          details: (
            <ConfirmMafFileError
              modelName={modelName}
              error={GDC_MODEL_STATES.singleNgcmPlusEngcm}
              files={error.files}
              tissueStatus={error.tissueStatus}
            />
          ),
          timeout: false,
          modelName,
          onClose: () => { acknowledgeImportStatus(modelName) },
        });
        break;
      case GDC_MODEL_STATES.noNgcm:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Import Error with Action Required.',
          details: (
            <ConfirmMafFileError
              modelName={modelName}
              error={GDC_MODEL_STATES.noNgcm}
              files={error.files}
              tissueStatus={error.tissueStatus}
            />
          ),
          timeout: false,
          modelName,
          onClose: () => { acknowledgeImportStatus(modelName) },
        });
        break;
      case GDC_MODEL_STATES.multipleNgcm:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Import Error with Action Required.',
          details: (
            <ConfirmMafFileError
              modelName={modelName}
              error={GDC_MODEL_STATES.multipleNgcm}
              files={error.files}
              tissueStatus={error.tissueStatus}
            />
          ),
          timeout: false,
          modelName,
          onClose: () => { acknowledgeImportStatus(modelName) },
        });
        break;
      case GDC_MODEL_STATES.noMafs:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Import Error with No Action Required.',
          details: (
            <>
              {modelName} was found in GDC, <strong>but no MAF files were found.</strong>
            </>
          ),
          timeout: false,
          modelName,
          onClose: () => { acknowledgeImportStatus(modelName) },
        });
        break;
      case GDC_MODEL_STATES.modelNotFound:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Import Error with No Action Required.',
          details: (
            <>
              {modelName} <strong>was not found in GDC.</strong>
            </>
          ),
          timeout: false,
          modelName,
          onClose: () => { acknowledgeImportStatus(modelName) },
        });
        break;
      case GENOMIC_VARIANTS_IMPORT_ERRORS.noMatchingModel:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Import Error with No Action Required.',
          details: (
            <>
              {modelName} <strong>was not found in the local database.</strong> Please make sure the model exists and try again later.
            </>
          ),
          timeout: false,
          modelName,
          onClose: () => { acknowledgeImportStatus(modelName) },
        });
        break;
      case GENOMIC_VARIANTS_IMPORT_ERRORS.gdcCommunicationError:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Import Error: There has been a communication error with the GDC API.',
          details: 'Please investigate with the GDC team and try again later.',
          timeout: false,
          modelName,
          onClose: () => { acknowledgeImportStatus(modelName) },
        });
        break;
      case GENOMIC_VARIANTS_IMPORT_ERRORS.unexpected:
      default:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: `Import Error with No Action Required: An unexpected error occured while importing research variants for ${modelName}`,
          details: error.message,
          timeout: false,
          modelName,
          onClose: () => { acknowledgeImportStatus(modelName) },
        });
        break;
    }
  };

  const showImportStatusCheckError = error => {
    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message: `Import Status Error: An unexpected error occured while fetching the status of any running imports.`,
      details: error.message,
      timeout: false,
    });
  };

  const showBulkNonActionableImportErrors = (modelNotFound, noMafs) => {
    const modelName = 'BULK_NONACTIONABLE_IMPORT_ERRORS';
    if (notifications.find(x => x.modelName === modelName)) {
      console.log('showBulkNonActionableImportErrors found existing, updating instead');
      updateBulkNonActionableImportErrors(modelNotFound, noMafs);
      return;
    }

    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message: 'Import Errors with No Action Required.',
      details: <BulkNonActionableImportErrors modelNotFound={modelNotFound} noMafs={noMafs} />,
      timeout: false,
      modelName: modelName,
      onClose: () => { acknowledgeBulkImportStatus([...modelNotFound, ...noMafs]) },
    });
  };

  const updateBulkNonActionableImportErrors = (modelNotFound, noMafs) => {
    const modelName = 'BULK_NONACTIONABLE_IMPORT_ERRORS';
    const existingNotification = notifications.find(x => x.modelName === modelName);

    if (!existingNotification) {
      console.log('updateBulkNonActionableImportErrors did not find existing, showing instead');
      showBulkNonActionableImportErrors(modelNotFound, noMafs);
      return;
    }

    const index = notifications.findIndex(x => x.modelName === modelName);

    existingNotification.details = <BulkNonActionableImportErrors modelNotFound={modelNotFound} noMafs={noMafs} />;
    existingNotification.onClose = () => { acknowledgeBulkImportStatus([...modelNotFound, ...noMafs]) };

    setNotifications(notifications => [...notifications.slice(0, index), existingNotification, ...notifications.slice(index + 1)]);
  };

  const updateNotificationsFromStatus = importStatus => {
    setImportProgress(importStatus);

    // Add import notifications for individual imports in the queue
    const individualQueuedImports = importStatus.queue.filter(x => x.importType === 'INDIVIDUAL');
    individualQueuedImports.forEach(importItem => {
      const modelName = importItem.modelName;
      addImportNotification(modelName);
    });

    // Remove import notification and show stopped notification for stopped individual imports
    const individualStoppedImports = importStatus.stopped.filter(x => x.importType === 'INDIVIDUAL');
    individualStoppedImports.forEach(stoppedImport => {
      const modelName = stoppedImport.modelName;
      removeImportNotification(modelName);
      showStoppedImportNotification(modelName);
    });

    // Remove import notification and show success notification for completed individual imports
    const individualCompletedImports = importStatus.success.filter(x => x.importType === 'INDIVIDUAL');
    individualCompletedImports.forEach(completedImport => {
      const modelName = completedImport.modelName;
      removeImportNotification(modelName);
      showSuccessfulImportNotification(modelName);
    });

    // Add import error notifications for failed imports
    const failedImports = importStatus.failed;
    let bulkModelNotFound = [...nonactionableImports[GDC_MODEL_STATES.modelNotFound]];
    let bulkNoMafs = [...nonactionableImports[GDC_MODEL_STATES.noMafs]];

    failedImports.forEach(failedImport => {
      const modelName = failedImport.modelName;

      if (failedImport.importType === 'INDIVIDUAL') {
        removeImportNotification(modelName);
      }

      if (failedImport.actionable || failedImport.importType === 'INDIVIDUAL') {
        // Actionable errors and errors for individual imports get shown normally
        showErrorImportNotification(modelName, failedImport);
      } else {
        // Non-actionable errors for bulk imports get grouped together
        switch (failedImport.error.code) {
          case GDC_MODEL_STATES.modelNotFound:
            if (!bulkModelNotFound.find(x => x === modelName)) {
              bulkModelNotFound.push(modelName);
            }
            break;
          case GDC_MODEL_STATES.noMafs:
            if (!bulkNoMafs.find(x => x === modelName)) {
              bulkNoMafs.push(modelName);
            }
            break;
          default:
            break;
        }
      }
    });

    if (bulkModelNotFound.length || bulkNoMafs.length) {
      setNonactionableImports({
        [GDC_MODEL_STATES.modelNotFound]: bulkModelNotFound,
        [GDC_MODEL_STATES.noMafs]: bulkNoMafs,
      });
      showBulkNonActionableImportErrors(bulkModelNotFound, bulkNoMafs);
    }
  };

  return {
    importNotifications: getImportNotifications(),
    setImportNotifications,
    addImportNotification,
    removeImportNotification,
    showSuccessfulImportNotification,
    showErrorImportNotification,
    showImportStatusCheckError,
    updateNotificationsFromStatus,
    importRunning: importProgress.running,
  };
};

export default useGenomicVariantImportNotifications;
