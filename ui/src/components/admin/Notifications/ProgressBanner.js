import React, { useContext } from 'react';

import { acknowledgeBulkImportStatus, stopAllImports } from 'components/admin/Model/actions/GenomicVariants';
import useGenomicVariantImportNotifications from 'components/admin/Notifications/GenomicVariantImportNotifications';
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
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarSectionComplete,
  ProgressBarSectionFailed,
  ProgressBarSectionIncomplete,
  ProgressBarLabel,
} from 'theme/adminNotificationStyles';
import { Row, Col } from 'theme/system';
import base from 'theme';

import {
  BULK_NONACTIONABLE_ERROR_ID,
  VARIANT_IMPORT_STATUS,
  VARIANT_IMPORT_TYPES,
} from 'utils/constants';

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
  const { importProgress } = useContext(NotificationsContext);
  const { updateImportNotifications, showUnexpectedImportError, hideErrorImportNotification } = useGenomicVariantImportNotifications();

  const getBulkImports = () => {
    if (!importProgress) {
      return [];
    }

    return [
      ...importProgress.queue,
      ...importProgress.failed,
      ...importProgress.stopped,
      ...importProgress.success,
    ].filter(x => x.importType === VARIANT_IMPORT_TYPES.bulk);
  }

  const getProgressBannerType = () => {
    if (!importProgress) {
      return false;
    }

    return importProgress.running
      ? NOTIFICATION_TYPES.LOADING
      : NOTIFICATION_TYPES.SUCCESS;
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
    } else if (getBulkImports().filter(x => x.status === VARIANT_IMPORT_STATUS.stopped).length) {
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
        completeImports = getBulkImports().filter(x => x.status === VARIANT_IMPORT_STATUS.complete);
        return `Import Complete: Research somatic variants for ${completeImports.length} model${completeImports.length === 1 ? ' has' : 's have'} successfully imported.`;
      case BulkImportState.importing:
        return `Importing: Research somatic variants for ${getBulkImports().length} model${getBulkImports().length === 1 ? ' is' : 's are'} currently importing.`;
      case BulkImportState.stopped:
        completeImports = getBulkImports().filter(x => x.status === VARIANT_IMPORT_STATUS.complete);
        return `Import Stopped: Research somatic variants for ${completeImports.length} model${completeImports.length === 1 ? ' has' : 's have'} successfully imported.`;
      default:
        // No visible banner for 'OFF'
        return null;
    }
  };

  const renderProgressBar = () => {
    const success = getBulkImports().filter(x => x.status === VARIANT_IMPORT_STATUS.complete);
    const failed = getBulkImports().filter(x => x.status === VARIANT_IMPORT_STATUS.error);
    const incomplete = getBulkImports().filter(x =>
      x.status === VARIANT_IMPORT_STATUS.active
      || x.status === VARIANT_IMPORT_STATUS.waiting
      || x.status === VARIANT_IMPORT_STATUS.stopped
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

    return (
      <Row>
        <Col>
          <Row>
            <ProgressBarContainer>
              <ProgressBarWrapper>
                <ProgressBarSectionComplete num={success.length} total={getBulkImports().length} />
                <ProgressBarSectionFailed num={failed.length} total={getBulkImports().length} />
                <ProgressBarSectionIncomplete num={incomplete.length} total={getBulkImports().length} />
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
      <Col>
        <Message>{getProgressBannerMessage()}</Message>
        <Details>{getProgressBannerDetails()}</Details>
      </Col>
      <Col style={{ padding: '0 12px' }}>
        {renderProgressBar()}
      </Col>
      {getProgressBannerType() === NOTIFICATION_TYPES.LOADING && (
        useConfirmationModal({
          title: 'Stop Variant Import?',
          message:
            'Are you sure you want to stop this variant import?',
          confirmLabel: 'Yes, Stop',
          onConfirm: async () => {
            stopAllImports().then(_ => {
              updateImportNotifications();
            }).catch(error => {
              showUnexpectedImportError(error);
            });
          },
        })(
          <ButtonPill
            secondary
            style={{
              marginRight: 0,
              marginLeft: 'auto'
            }}
          >
            Stop Import
          </ButtonPill>,
        )
      )}
      {getProgressBannerType() !== NOTIFICATION_TYPES.LOADING && (
        <CrossCircleIcon
          width={'17px'}
          height={'17px'}
          fill={trout}
          style={closeIcon}
          onClick={() => {
            acknowledgeBulkImportStatus(
              getBulkImports().map(x => x.modelName)
            ).then(data => {
              if (data.success) {
                // Remove error notifications for acknowledged errors
                (data.acknowledged || []).forEach(model => {
                  hideErrorImportNotification(model.modelName);
                });
                // Remove bulk nonactionable error notification
                hideErrorImportNotification(BULK_NONACTIONABLE_ERROR_ID);
              }
              updateImportNotifications();
            }).catch(error => {
              showUnexpectedImportError(error);
            });
          }}
        />
      )}
    </Notification>
  );
};

export default ProgressBanner;
