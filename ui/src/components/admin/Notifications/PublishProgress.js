/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  acknowledgeBulkPublishStatus,
  stopAllPublishes,
} from 'components/admin/Model/actions/Publish';
import usePublishNotifications from 'components/admin/Notifications/PublishNotifications';
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

import { PUBLISH_STATUS, PUBLISH_TYPES } from 'utils/constants';

const {
  keyedPalette: { trout },
} = base;

const BulkPublishState = {
  complete: 'COMPLETE',
  stopped: 'STOPPED',
  publishing: 'PUBLISHING',
  off: 'OFF',
};

const PublishProgress = ({ renderIcon }) => {
  const { publishProgress, location } = useContext(NotificationsContext);
  const { refreshModelsTable } =
    location && location.pathname === '/admin'
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useContext(ModelManagerContext)
      : { refreshModelsTable: null };
  const {
    fetchPublishStatus,
    showUnexpectedPublishError,
    hideErrorPublishNotification,
  } = usePublishNotifications();
  const [working, setWorking] = useState(false);
  const prevPublishState = useRef();

  const getBulkPublishes = () => {
    if (!publishProgress) {
      return [];
    }

    return [
      ...publishProgress.queue,
      ...publishProgress.failed,
      ...publishProgress.stopped,
      ...publishProgress.success,
    ].filter(x => x.publishType === PUBLISH_TYPES.bulk);
  };

  const getProgressBannerType = () => {
    if (!publishProgress) {
      return false;
    }

    return publishProgress.running ? NOTIFICATION_TYPES.LOADING : NOTIFICATION_TYPES.SUCCESS;
  };

  const getProgressBannerDetails = () => {
    switch (getBulkPublishState()) {
      case BulkPublishState.publishing:
        return 'You can continue to use the CMS, and will be notified of the status for each publish. Note that some functionality is unavailable during bulk publish.';
      case BulkPublishState.complete:
      case BulkPublishState.stopped:
        return 'You may resume normal operation of the CMS.';
      default:
        // No visible banner for 'OFF'
        return null;
    }
  };

  const getBulkPublishState = () => {
    if (!publishProgress) {
      return BulkPublishState.off;
    }

    if (publishProgress.running && getBulkPublishes().length) {
      // Bulk publish is currently running
      return BulkPublishState.publishing;
    } else if (publishProgress.running && !getBulkPublishes().length) {
      // Only individual publishes running, no bulk
      return BulkPublishState.off;
    } else if (getBulkPublishes().filter(x => x.status === PUBLISH_STATUS.stopped).length) {
      // Bulk publish has been stopped
      return BulkPublishState.stopped;
    } else {
      // Bulk publish is complete
      return BulkPublishState.complete;
    }
  };

  const getProgressBannerMessage = () => {
    let completePublishes;
    switch (getBulkPublishState()) {
      case BulkPublishState.complete:
        completePublishes = getBulkPublishes().filter(x => x.status === PUBLISH_STATUS.complete);
        return `Bulk Publish Complete: ${completePublishes.length} model${
          completePublishes.length === 1 ? ' has' : 's have'
        } been published.`;
      case BulkPublishState.publishing:
        return `Publishing: ${getBulkPublishes().length} model${
          getBulkPublishes().length === 1 ? ' is' : 's are'
        } currently publishing.`;
      case BulkPublishState.stopped:
        completePublishes = getBulkPublishes().filter(x => x.status === PUBLISH_STATUS.complete);
        return `Bulk Publish Stopped: ${completePublishes.length} model${
          completePublishes.length === 1 ? ' has' : 's have'
        } successfully published.`;
      default:
        // No visible banner for 'OFF'
        return null;
    }
  };

  const ProgressBar = () => {
    const success = getBulkPublishes().filter(x => x.status === PUBLISH_STATUS.complete);
    const failed = getBulkPublishes().filter(x => x.status === PUBLISH_STATUS.error);
    const incomplete = getBulkPublishes().filter(
      x =>
        x.status === PUBLISH_STATUS.active ||
        x.status === PUBLISH_STATUS.waiting ||
        x.status === PUBLISH_STATUS.stopped,
    );

    const meta = () => {
      switch (getBulkPublishState()) {
        case BulkPublishState.publishing:
          return `In Progress: ${incomplete.length}`;
        case BulkPublishState.complete:
          return `Publish Complete`;
        case BulkPublishState.stopped:
          return `Incomplete: ${incomplete.length}`;
        default:
          // No visible banner for 'OFF'
          return null;
      }
    };

    useEffect(() => {
      if (!prevPublishState) {
        prevPublishState.current = getBulkPublishState();
        return;
      }

      if (
        refreshModelsTable &&
        (getBulkPublishState() === BulkPublishState.complete ||
          getBulkPublishState() === BulkPublishState.stopped) &&
        prevPublishState.current === BulkPublishState.publishing
      ) {
        refreshModelsTable();
      }

      prevPublishState.current = getBulkPublishState();
    }, [publishProgress, prevPublishState, refreshModelsTable]);

    return (
      <Row>
        <Col>
          <Row>
            <ProgressBarContainer>
              <ProgressBarWrapper>
                <ProgressBarSectionComplete
                  num={success.length}
                  total={getBulkPublishes().length}
                />
                <ProgressBarSectionFailed num={failed.length} total={getBulkPublishes().length} />
                <ProgressBarSectionIncomplete
                  num={incomplete.length}
                  total={getBulkPublishes().length}
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
          title: 'Stop Bulk Publish?',
          message: 'Are you sure you want to stop this bulk publish?',
          confirmLabel: 'Yes, Stop',
          onConfirm: async () => {
            setWorking(true);
            stopAllPublishes()
              .then(async _ => {
                await fetchPublishStatus();
                setWorking(false);
              })
              .catch(error => {
                showUnexpectedPublishError(error);
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
            Stop Bulk Publish
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
            acknowledgeBulkPublishStatus(getBulkPublishes().map(x => x.modelName))
              .then(async data => {
                if (data.success) {
                  // Remove error notifications for acknowledged errors
                  (data.acknowledged || []).forEach(model => {
                    hideErrorPublishNotification(model.modelName);
                  });
                }
                await fetchPublishStatus();
              })
              .catch(error => {
                showUnexpectedPublishError(error);
              });
          }}
        />
      )}
    </Notification>
  );
};

export default PublishProgress;
