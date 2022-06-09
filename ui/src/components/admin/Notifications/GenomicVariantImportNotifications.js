import React, { useContext, useEffect, useState } from 'react';

import { NotificationsContext } from './NotificationsController';

import {
  acknowledgeImportStatus,
  acknowledgeBulkImportStatus,
  checkImportStatus,
} from 'components/admin/Model/actions/GenomicVariants';
import { isEqual } from 'components/admin/helpers/notifications';
import withConfirmMafFileModal from 'components/modals/ConfirmMafFileModal';

import NOTIFICATION_TYPES from './NotificationTypes';
import {
  BULK_NONACTIONABLE_ERROR_ID,
  GDC_MODEL_STATES,
  GENOMIC_VARIANTS_IMPORT_ERRORS,
  VARIANT_IMPORT_TYPES,
} from 'utils/constants';

import { ButtonPill } from 'theme/adminControlsStyles';
import {
  NotificationTableHeaderRow,
  NotificationTableHeaderCol,
} from 'theme/adminNotificationStyles';
import { Row } from 'theme/system';

// Unicode 'NON-BREAKING HYPHEN' (U+2011), prevents word-wrap on model names
const replaceHyphens = text => text.replaceAll('-', '‑');

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
};

const ConfirmMafFileError = ({ modelName, tissueStatus, files, error, onConfirm }) => {
  return (
    <>
      {modelName} was found in GDC, but <strong>{getImportErrorMessage(error)}</strong>
      Please investigate:
      {withConfirmMafFileModal({
        modelName,
        tissueStatus,
        files,
        onConfirm,
      })(
        <ButtonPill
          secondary
          marginLeft="12px"
          style={{
            display: 'inline-flex',
            verticalAlign: 'bottom',
          }}
        >
          Confirm MAF File
        </ButtonPill>,
      )}
    </>
  );
};

const BulkNonActionableImportErrors = () => {
  const { nonactionableImports } = useContext(NotificationsContext);
  const [modelNotFound, setModelNotFound] = useState([]);
  const [noMafs, setNoMafs] = useState([]);

  useEffect(() => {
    if (nonactionableImports) {
      if (!isEqual(nonactionableImports[GDC_MODEL_STATES.modelNotFound], modelNotFound)) {
        setModelNotFound(nonactionableImports[GDC_MODEL_STATES.modelNotFound]);
      }

      if (!isEqual(nonactionableImports[GDC_MODEL_STATES.noMafs], noMafs)) {
        setNoMafs(nonactionableImports[GDC_MODEL_STATES.modelNotFound]);
      }
    }
  }, [nonactionableImports, modelNotFound, noMafs]);

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
          {modelNotFound.map((modelName, i) =>
            i < modelNotFound.length - 1
              ? `${replaceHyphens(modelName)}, `
              : replaceHyphens(modelName),
          )}
        </NotificationTableHeaderCol>
        <NotificationTableHeaderCol>
          {noMafs.map((modelName, i) =>
            i < noMafs.length - 1 ? `${replaceHyphens(modelName)}, ` : replaceHyphens(modelName),
          )}
        </NotificationTableHeaderCol>
      </Row>
    </>
  );
};

const useGenomicVariantImportNotifications = () => {
  const {
    notifications,
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

    if (existingNotification) {
      existingNotification.clear();
    }

    const notification = await appendNotification({
      type: NOTIFICATION_TYPES.LOADING,
      message: `Importing: Research Variants for ${modelName} are currently importing.`,
      details: 'You can continue to use the CMS, and will be notified when the import is complete.',
      timeout: false,
    });

    setImportNotifications(notifications => [
      ...notifications.filter(notification => notification.modelName !== modelName),
      {
        modelName: modelName,
        notificationId: notification.id,
        clear: notification.clear,
      },
    ]);
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
      onClose: () => {
        acknowledgeModelAndUpdateNotifications(modelName);
      },
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
      onClose: () => {
        acknowledgeModelAndUpdateNotifications(modelName);
      },
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
              onConfirm={
                error.importType === VARIANT_IMPORT_TYPES.individual
                  ? () => addImportNotification(modelName)
                  : fetchImportStatus
              }
            />
          ),
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
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
              onConfirm={
                error.importType === VARIANT_IMPORT_TYPES.individual
                  ? () => addImportNotification(modelName)
                  : fetchImportStatus
              }
            />
          ),
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
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
              onConfirm={
                error.importType === VARIANT_IMPORT_TYPES.individual
                  ? () => addImportNotification(modelName)
                  : fetchImportStatus
              }
            />
          ),
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
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
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
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
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
        });
        break;
      case GENOMIC_VARIANTS_IMPORT_ERRORS.noMatchingModel:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Import Error with No Action Required.',
          details: (
            <>
              {modelName} <strong>was not found in the local database.</strong> Please make sure the
              the model exists and try again later.
            </>
          ),
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
        });
        break;
      case GENOMIC_VARIANTS_IMPORT_ERRORS.gdcCommunicationError:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Import Error: There has been a communication error with the GDC API.',
          details: 'Please investigate with the GDC team and try again later.',
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
        });
        break;
      case GENOMIC_VARIANTS_IMPORT_ERRORS.manualImportError:
        appendNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: 'Manual Import Error',
          details:
            'The MAF file you are trying to import was not found in GDC. Please investigate and try again.',
          timeout: false,
          modelName,
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
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
          onClose: () => {
            acknowledgeModelAndUpdateNotifications(modelName);
          },
        });
        break;
    }
  };

  // Remove a model's error notification without triggering onClose function
  const hideErrorImportNotification = modelName => {
    const existingNotification = notifications.find(x => x.modelName === modelName);

    if (existingNotification) {
      existingNotification.clear();
    }
  };

  const showUnexpectedImportError = error => {
    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message:
        'Import Error with No Action Required: An unexpected error related to Research Somatic Variant importing has occurred.',
      details: error.message || error.details || error.name,
      timeout: false,
    });
  };

  const showBulkNonActionableImportErrors = () => {
    const modelName = BULK_NONACTIONABLE_ERROR_ID;

    // Hide if there are no bulk nonactionable errors
    if (!getNonActionableImportErrorModels().length) {
      hideBulkNonActionableImportErrors();
      return;
    }

    // Remove existing notification before adding new values, brings it back to the top of the list
    if (notifications.find(x => x.modelName === modelName)) {
      hideBulkNonActionableImportErrors();
    }

    appendNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message: 'Import Errors with No Action Required.',
      details: <BulkNonActionableImportErrors />,
      timeout: false,
      modelName: modelName,
      onClose: () => {
        // Can't access the latest state normally since the callback is bound when the notification is created
        // Use 'setState' without updating the state to access the latest value within a bound callback
        // Via: https://stackoverflow.com/q/57847594
        setNonactionableImports(currentNonActionableImports => {
          acknowledgeBulkAndUpdateNotifications([
            ...currentNonActionableImports[GDC_MODEL_STATES.modelNotFound],
            ...currentNonActionableImports[GDC_MODEL_STATES.noMafs],
          ]);
          return currentNonActionableImports;
        });
      },
    });
  };

  const hideBulkNonActionableImportErrors = () => {
    hideErrorImportNotification(BULK_NONACTIONABLE_ERROR_ID);
  };

  const getNonActionableImportErrorModels = () => {
    return [
      ...nonactionableImports[GDC_MODEL_STATES.modelNotFound],
      ...nonactionableImports[GDC_MODEL_STATES.noMafs],
    ];
  };

  const updateNotificationsFromStatus = async () => {
    const { queue, stopped, success, failed } = importProgress;

    // Add import notifications for individual imports in the queue
    const individualQueuedImports = (queue || []).filter(
      x => x.importType === VARIANT_IMPORT_TYPES.individual,
    );
    individualQueuedImports.forEach(importItem => {
      const modelName = importItem.modelName;
      if (!getImportNotifications().find(x => x.modelName === modelName)) {
        addImportNotification(modelName);
      }
    });

    // Remove import notification and show stopped notification for stopped individual imports
    const individualStoppedImports = (stopped || []).filter(
      x => x.importType === VARIANT_IMPORT_TYPES.individual,
    );
    individualStoppedImports.forEach(stoppedImport => {
      const modelName = stoppedImport.modelName;
      removeImportNotification(modelName);
      showStoppedImportNotification(modelName);
    });

    // Remove import notification and show success notification for completed individual imports
    const individualCompletedImports = (success || []).filter(
      x => x.importType === VARIANT_IMPORT_TYPES.individual,
    );
    individualCompletedImports.forEach(completedImport => {
      const modelName = completedImport.modelName;
      removeImportNotification(modelName);
      showSuccessfulImportNotification(modelName);
    });

    // Remove import errors for re-queued bulk imports (resolved errors)
    const bulkQueuedImports = (queue || []).filter(x => x.importType === VARIANT_IMPORT_TYPES.bulk);
    bulkQueuedImports.forEach(queuedImport => {
      const modelName = queuedImport.modelName;
      hideErrorImportNotification(modelName);
    });

    // Remove import errors for completed bulk imports
    const bulkCompletedImports = (success || []).filter(
      x => x.importType === VARIANT_IMPORT_TYPES.bulk,
    );
    bulkCompletedImports.forEach(completedImport => {
      const modelName = completedImport.modelName;
      hideErrorImportNotification(modelName);
    });

    // Add import error notifications for failed imports
    const failedImports = failed || [];
    const bulkModelNotFound = [...nonactionableImports[GDC_MODEL_STATES.modelNotFound]];
    const bulkNoMafs = [...nonactionableImports[GDC_MODEL_STATES.noMafs]];
    let newBulkModelNotFound = [];
    let newBulkNoMafs = [];

    failedImports.forEach(failedImport => {
      const modelName = failedImport.modelName;

      if (failedImport.importType === VARIANT_IMPORT_TYPES.individual) {
        removeImportNotification(modelName);
      }

      if (failedImport.actionable || failedImport.importType === VARIANT_IMPORT_TYPES.individual) {
        // Actionable errors and errors for individual imports get shown normally
        showErrorImportNotification(modelName, failedImport);
      } else {
        // Non-actionable errors for bulk imports get grouped together
        switch (failedImport.error.code) {
          case GDC_MODEL_STATES.modelNotFound:
            newBulkModelNotFound.push(modelName);
            break;
          case GDC_MODEL_STATES.noMafs:
            newBulkNoMafs.push(modelName);
            break;
          default:
            break;
        }
      }
    });

    // Update non-actionable import errors if the models have changed
    if (!isEqual(bulkModelNotFound, newBulkModelNotFound) || !isEqual(bulkNoMafs, newBulkNoMafs)) {
      setNonactionableImports({
        [GDC_MODEL_STATES.modelNotFound]: newBulkModelNotFound,
        [GDC_MODEL_STATES.noMafs]: newBulkNoMafs,
      });
    }
  };

  const fetchImportStatus = async () => {
    await checkImportStatus()
      .then(importStatus => {
        setImportProgress(importStatus);
      })
      .catch(error => {
        showUnexpectedImportError(error);
      });
  };

  const acknowledgeModelAndUpdateNotifications = async modelName => {
    await acknowledgeImportStatus(modelName)
      .then(async _ => {
        await fetchImportStatus();
      })
      .catch(error => {
        showUnexpectedImportError(error);
      });
  };

  const acknowledgeBulkAndUpdateNotifications = async modelNames => {
    await acknowledgeBulkImportStatus(modelNames)
      .then(async _ => {
        await fetchImportStatus();
      })
      .catch(error => {
        showUnexpectedImportError(error);
      });
  };

  return {
    importNotifications: getImportNotifications(),
    addImportNotification,
    showErrorImportNotification,
    showUnexpectedImportError,
    updateNotificationsFromStatus,
    fetchImportStatus,
    hideErrorImportNotification,
    importRunning: importProgress.running,
    showBulkNonActionableImportErrors,
    hideBulkNonActionableImportErrors,
    getNonActionableImportErrorModels,
  };
};

export default useGenomicVariantImportNotifications;
