import React, { useContext, useState } from 'react';
import Component from 'react-component-component';
import { scroller } from 'react-scroll';
import Spinner from 'react-spinkit';

import { acknowledgeBulkImportStatus, stopAllImports } from 'components/admin/Model/actions/GenomicVariants';
import useGenomicVariantImportNotifications from 'components/admin/Notifications/GenomicVariantImportNotifications';
import useConfirmationModal from 'components/modals/ConfirmationModal';
import { NotificationsContext } from './NotificationsController';
import { NOTIFICATION_TYPES } from './../Notifications';

import CheckmarkIcon from 'icons/CheckmarkIcon';
import CrossCircleIcon from 'icons/CrossCircleIcon';
import ErrorTriangleIcon from 'icons/ErrorTriangleIcon';

import { ButtonPill } from 'theme/adminControlsStyles';
import {
  NotificationsToaster,
  Notification,
  Message,
  Details,
  MessageLink,
  ErrorsRow,
  ErrorsCol,
  ErrorLabel,
  ErrorText,
  closeIcon,
  ShowHideButton,
  ShowHideButtonLabel,
  PlusMinusIcon,
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBarSectionComplete,
  ProgressBarSectionFailed,
  ProgressBarSectionIncomplete,
} from 'theme/adminNotificationStyles';
import { Row, Col } from 'theme/system';
import base from 'theme';

import {
  BULK_NONACTIONABLE_ERROR_ID,
  VARIANT_IMPORT_STATUS,
  VARIANT_IMPORT_TYPES,
} from 'utils/constants';

const {
  keyedPalette: { alizarinCrimson, pelorousapprox, trout, yellowOrange },
} = base;

const scrollIntoView = () =>
  scroller.scrollTo('notifications-toaster', {
    duration: 500,
    smooth: true,
    offset: -20,
  });

const renderIcon = type => {
  if (!type) {
    return null;
  }

  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return (
        <CheckmarkIcon
          width={'30px'}
          height={'30px'}
          style={`
            background-color: ${pelorousapprox};
            border-radius: 100%;
            padding: 7px;
            margin-right: 12px;
          `}
        />
      );
    case NOTIFICATION_TYPES.LOADING:
      return (
        <Spinner
          fadeIn="none"
          name="circle"
          style={{
            width: 30,
            height: 30,
            margin: '0px 12px 0px 0px',
          }}
        />
      );
    case NOTIFICATION_TYPES.ERROR:
      return (
        <ErrorTriangleIcon
          fill={alizarinCrimson}
          style={`
            margin-right: 12px;
          `}
        />
      );
    case NOTIFICATION_TYPES.WARNING:
      return (
        <ErrorTriangleIcon
          fill={yellowOrange}
          style={`
            margin-right: 12px;
          `}
        />
      );
    default:
      return null;
  }
};

const BulkImportState = {
  complete: 'COMPLETE',
  stopped: 'STOPPED',
  importing: 'IMPORTING',
  off: 'OFF',
};

export default () => {
  const { notifications, clearNotification, importProgress } = useContext(NotificationsContext);
  const { updateImportNotifications, showUnexpectedImportError, hideErrorImportNotification } = useGenomicVariantImportNotifications();
  const [showMore, setShowMore] = useState(false);

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

  const isActiveBulkImport = () => !!getBulkImports().length;

  const getProgressBannerType = () => {
    if (!importProgress) {
      return false;
    }

    return importProgress.running
      ? NOTIFICATION_TYPES.LOADING
      : NOTIFICATION_TYPES.SUCCESS;
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
            <span>Success: {success.length}</span>
            <span>Failed: {failed.length}</span>
          </Row>
        </Col>
        <Col>
          <span style={{ marginLeft: '8px' }}>{meta()}</span>
        </Col>
      </Row>
    );
  };

  return (
    <Component
      notifications={notifications}
      didUpdate={({ props, prevProps }) => {
        // If we have new notifications (do not scroll on removal)
        if (props.notifications.length > prevProps.notifications.length) {
          scrollIntoView();
        }
      }}
    >
      <NotificationsToaster name="notifications-toaster">
        {isActiveBulkImport() && (
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
        )}
        {notifications.slice(notifications.length > 5 && !showMore ? notifications.length - 5 : 0).reverse().map(notification => (
          <Notification key={notification.id} type={notification.type}>
            {renderIcon(notification.type)}
            <Col width={'100%'}>
              <Message>{notification.message}</Message>
              {notification.details && (
                <Details>
                  {notification.details}
                  {notification.bulkErrors && notification.bulkErrors.length > 0 && (
                    <ErrorsCol marginTop="16px">
                      {notification.bulkErrors.map(error => {
                        const details =
                          error.name === 'ValidationError' ? error.errors : error.details;
                        const name =
                          error.name === 'ValidationError' ? error.value.name : error.name;
                        return (
                          <ErrorsCol marginBottom="16px">
                            <ErrorsRow>
                              <ErrorLabel>Name: </ErrorLabel>
                              <ErrorText>{name}</ErrorText>
                            </ErrorsRow>
                            <ErrorsRow>
                              <ErrorLabel>Errors: </ErrorLabel>
                              <ErrorsCol>
                                {details.map(detail => (
                                  <ErrorText>{detail}</ErrorText>
                                ))}
                              </ErrorsCol>
                            </ErrorsRow>
                          </ErrorsCol>
                        );
                      })}
                    </ErrorsCol>
                  )}
                </Details>
              )}
              {notification.link && (
                <MessageLink href={notification.link} type={notification.type} target="_blank">
                  {notification.linkText || 'Link'}
                </MessageLink>
              )}
            </Col>
            {notification.type !== NOTIFICATION_TYPES.LOADING && (
              <CrossCircleIcon
                width={'17px'}
                height={'17px'}
                fill={trout}
                style={closeIcon}
                onClick={() => clearNotification(notification.id)}
              />
            )}
          </Notification>
        ))}
        {notifications.length > 5 && (
          <ShowHideButton onClick={() => setShowMore(!showMore)}>
            <PlusMinusIcon showMore={showMore}>
              {showMore ? '-' : '+'}
            </PlusMinusIcon>
            <ShowHideButtonLabel>
              {`${showMore ? 'Hide' : 'Show'} ${notifications.length - 5} ${
                showMore
                  ? notifications.length - 5 === 1 ? 'notification' : 'notifications'
                  : 'more'
                }`
              }
            </ShowHideButtonLabel>
          </ShowHideButton>
        )}
      </NotificationsToaster>
    </Component>
  );
};
