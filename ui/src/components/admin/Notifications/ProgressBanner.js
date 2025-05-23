/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  acknowledgeBulkImportStatus,
  stopAllImports,
} from 'components/admin/Model/actions/GenomicVariants';
import useGenomicVariantImportNotifications from 'components/admin/Notifications/GenomicVariantImportNotifications';
import { ModelManagerContext } from 'components/admin/ModelsManager/ModelManagerController';
import useConfirmationModal from 'components/modals/ConfirmationModal';
import { NotificationsContext } from './NotificationsController';
import NOTIFICATION_TYPES from './NotificationTypes';

import CheckmarkIcon from 'icons/CheckmarkIcon';
import CrossCircleIcon from 'icons/CrossCircleIcon';
import CrossIcon from 'icons/CrossIcon';

import { ButtonPill } from 'theme/adminControlsStyles';
import {
  Notification,
  Message,
  Details,
  closeIcon,
  closeIconDisabled,
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarSectionComplete,
  ProgressBarSectionFailed,
  ProgressBarSectionIncomplete,
  ProgressBarLabel,
} from 'theme/adminNotificationStyles';
import { Row, Col } from 'theme/system';
import base from 'theme';

import { VARIANT_IMPORT_STATUS, VARIANT_IMPORT_TYPES } from 'utils/constants';

const {
  keyedPalette: { trout },
} = base;

const BulkImportState = {
  complete: 'COMPLETE',
  stopped: 'STOPPED',
  importing: 'IMPORTING',
  off: 'OFF',
};

const ProgressBanner = ({ renderIcon }) => {
  const { importProgress, location } = useContext(NotificationsContext);
  const { refreshModelsTable } =
    location && location.pathname === '/admin'
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useContext(ModelManagerContext)
      : { refreshModelsTable: null };
  const {
    fetchImportStatus,
    showUnexpectedImportError,
    hideErrorImportNotification,
    hideBulkNonActionableImportErrors,
  } = useGenomicVariantImportNotifications();
  const [working, setWorking] = useState(false);
  const prevImportState = useRef();

  const getBulkImports = () => {
    if (!importProgress) {
      return [];
    }

    return [
      ...importProgress.queue,
      ...importProgress.failed,
      ...importProgress.stopped,
      ...importProgress.success,
    ].filter((x) => x.importType === VARIANT_IMPORT_TYPES.bulk);
  };

  const getProgressBannerType = () => {
    if (!importProgress) {
      return false;
    }

    return importProgress.running ? NOTIFICATION_TYPES.LOADING : NOTIFICATION_TYPES.SUCCESS;
  };

  const getProgressBannerDetails = () => {
    switch (getImportState()) {
      case BulkImportState.importing:
        return 'You can continue to use the CMS, and will be notified of the status for each import.';
      case BulkImportState.complete:
      case BulkImportState.stopped:
        return 'You can bulk publish the models below.';
      default:
        // No visible banner for 'OFF'
        return null;
    }
  };

  const getImportState = () => {
    if (!importProgress) {
      return BulkImportState.off;
    }

    if (importProgress.running && getBulkImports().length) {
      // Bulk import is currently running
      return BulkImportState.importing;
    } else if (importProgress.running && !getBulkImports().length) {
      // Only individual imports running, no bulk
      return BulkImportState.off;
    } else if (getBulkImports().filter((x) => x.status === VARIANT_IMPORT_STATUS.stopped).length) {
      // Bulk import has been stopped
      return BulkImportState.stopped;
    } else {
      // Bulk import is complete
      return BulkImportState.complete;
    }
  };

  const getProgressBannerMessage = () => {
    let completeImports;
    switch (getImportState()) {
      case BulkImportState.complete:
        completeImports = getBulkImports().filter(
          (x) => x.status === VARIANT_IMPORT_STATUS.complete,
        );
        return `Import Complete: Research somatic variants for ${completeImports.length} model${
          completeImports.length === 1 ? ' has' : 's have'
        } successfully imported.`;
      case BulkImportState.importing:
        return `Importing: Research somatic variants for ${getBulkImports().length} model${
          getBulkImports().length === 1 ? ' is' : 's are'
        } currently importing.`;
      case BulkImportState.stopped:
        completeImports = getBulkImports().filter(
          (x) => x.status === VARIANT_IMPORT_STATUS.complete,
        );
        return `Import Stopped: Research somatic variants for ${completeImports.length} model${
          completeImports.length === 1 ? ' has' : 's have'
        } successfully imported.`;
      default:
        // No visible banner for 'OFF'
        return null;
    }
  };

  const ProgressBar = () => {
    const success = getBulkImports().filter((x) => x.status === VARIANT_IMPORT_STATUS.complete);
    const failed = getBulkImports().filter((x) => x.status === VARIANT_IMPORT_STATUS.error);
    const incomplete = getBulkImports().filter(
      (x) =>
        x.status === VARIANT_IMPORT_STATUS.active ||
        x.status === VARIANT_IMPORT_STATUS.waiting ||
        x.status === VARIANT_IMPORT_STATUS.stopped,
    );

    const meta = () => {
      switch (getImportState()) {
        case BulkImportState.importing:
          return `In Progress: ${incomplete.length}`;
        case BulkImportState.complete:
          return `Import Complete`;
        case BulkImportState.stopped:
          return `Incomplete: ${incomplete.length}`;
        default:
          // No visible banner for 'OFF'
          return null;
      }
    };

    useEffect(() => {
      if (!prevImportState) {
        prevImportState.current = getImportState();
        return;
      }

      if (
        refreshModelsTable &&
        (getImportState() === BulkImportState.complete ||
          getImportState() === BulkImportState.stopped) &&
        prevImportState.current === BulkImportState.importing
      ) {
        refreshModelsTable();
      }

      prevImportState.current = getImportState();
    }, [importProgress, prevImportState, refreshModelsTable]);

    return (
      <Row>
        <Col>
          <Row>
            <ProgressBarContainer>
              <ProgressBarWrapper>
                <ProgressBarSectionComplete num={success.length} total={getBulkImports().length} />
                <ProgressBarSectionFailed num={failed.length} total={getBulkImports().length} />
                <ProgressBarSectionIncomplete
                  num={incomplete.length}
                  total={getBulkImports().length}
                />
              </ProgressBarWrapper>
            </ProgressBarContainer>
          </Row>
          <Row justifyContent={'space-between'}>
            <ProgressBarLabel>
              <CheckmarkIcon fill={'#3AB'} width={'10px'} height={'10px'} />
              Success: {success.length}
            </ProgressBarLabel>
            <ProgressBarLabel>
              <CrossIcon width={'8px'} height={'8px'} />
              Failed: {failed.length}
            </ProgressBarLabel>
          </Row>
        </Col>
        <Col>
          <span style={{ marginLeft: '8px' }}>{meta()}</span>
        </Col>
      </Row>
    );
  };

  return (
    <Notification type={getProgressBannerType()}>
      {renderIcon(getProgressBannerType())}
      <Col style={{ maxWidth: '50%', width: '100%' }}>
        <Message>{getProgressBannerMessage()}</Message>
        <Details>{getProgressBannerDetails()}</Details>
      </Col>
      <Col style={{ padding: '0 12px' }}>
        <ProgressBar />
      </Col>
      {getProgressBannerType() === NOTIFICATION_TYPES.LOADING &&
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useConfirmationModal({
          title: 'Stop Variant Import?',
          message: 'Are you sure you want to stop this variant import?',
          confirmLabel: 'Yes, Stop',
          onConfirm: async () => {
            setWorking(true);
            stopAllImports()
              .then(async (_) => {
                await fetchImportStatus();
                setWorking(false);
              })
              .catch((error) => {
                showUnexpectedImportError(error);
              });
          },
        })(
          <ButtonPill
            secondary
            style={{
              marginRight: 0,
              marginLeft: 'auto',
            }}
            disabled={working}
          >
            Stop Import
          </ButtonPill>,
        )}
      {getProgressBannerType() !== NOTIFICATION_TYPES.LOADING && (
        <CrossCircleIcon
          width={'17px'}
          height={'17px'}
          fill={trout}
          css={working ? closeIconDisabled : closeIcon}
          onClick={() => {
            if (working) {
              return;
            }

            setWorking(true);
            acknowledgeBulkImportStatus(getBulkImports().map((x) => x.modelName))
              .then(async (data) => {
                if (data.success) {
                  // Remove error notifications for acknowledged errors
                  (data.acknowledged || []).forEach((model) => {
                    hideErrorImportNotification(model.modelName);
                  });
                  // Remove bulk nonactionable error notification
                  hideBulkNonActionableImportErrors();
                }
                await fetchImportStatus();
              })
              .catch((error) => {
                showUnexpectedImportError(error);
              });
          }}
        />
      )}
    </Notification>
  );
};

export default ProgressBanner;
