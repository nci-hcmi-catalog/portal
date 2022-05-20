import React, { useContext, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import Component from 'react-component-component';
import { scroller } from 'react-scroll';
import Spinner from 'react-spinkit';

import { NotificationsContext } from './NotificationsController';
import useGenomicVariantImportNotifications from './GenomicVariantImportNotifications';
import NOTIFICATION_TYPES from './NotificationTypes';
import ProgressBanner from './ProgressBanner';

import CheckmarkIcon from 'icons/CheckmarkIcon';
import CrossCircleIcon from 'icons/CrossCircleIcon';
import ErrorTriangleIcon from 'icons/ErrorTriangleIcon';

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
  closeIconDisabled,
  ShowHideButton,
  ShowHideButtonLabel,
  PlusMinusIcon,
} from 'theme/adminNotificationStyles';
import { Col } from 'theme/system';
import base from 'theme';

import {
  VARIANT_IMPORT_TYPES,
} from 'utils/constants';

const {
  keyedPalette: { alizarinCrimson, pelorousapprox, trout, yellowOrange },
} = base;

const NOTIFICATION_LIMIT = 5;

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
          css={css`
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
          css={css`
            width: 30px;
            height: 30px;
            margin: 0px 12px 0px 0px;
          `}
        />
      );
    case NOTIFICATION_TYPES.ERROR:
      return (
        <ErrorTriangleIcon
          fill={alizarinCrimson}
          css={css`
            margin-right: 12px;
          `}
        />
      );
    case NOTIFICATION_TYPES.WARNING:
      return (
        <ErrorTriangleIcon
          fill={yellowOrange}
          css={css`
            margin-right: 12px;
          `}
        />
      );
    default:
      return null;
  }
};

export default () => {
  const {
    notifications,
    clearNotification,
    importProgress,
    nonactionableImports,
  } = useContext(NotificationsContext);
  const {
    updateNotificationsFromStatus,
    showBulkNonActionableImportErrors,
    hideBulkNonActionableImportErrors,
    getNonActionableImportErrorModels,
  } = useGenomicVariantImportNotifications();
  const [showMore, setShowMore] = useState(false);
  const [working, setWorking] = useState(false);

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

  useEffect(() => {
    updateNotificationsFromStatus();
  }, [importProgress]);

  useEffect(() => {
    if (nonactionableImports && getNonActionableImportErrorModels().length) {
      showBulkNonActionableImportErrors();
    } else {
      hideBulkNonActionableImportErrors();
    }
  }, [nonactionableImports])

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
          <ProgressBanner renderIcon={renderIcon} />
        )}
        {notifications.slice(notifications.length > NOTIFICATION_LIMIT && !showMore ? notifications.length - NOTIFICATION_LIMIT : 0).reverse().map(notification => (
          <Notification key={notification.id} type={notification.type}>
            {renderIcon(notification.type)}
            <Col width={'100%'}>
              <Message>{notification.message}</Message>
              {notification.details && (
                <Details>
                  {notification.details}
                  {notification.bulkErrors && notification.bulkErrors.length > 0 && (
                    <ErrorsCol marginTop="16px">
                      {notification.bulkErrors.map((error, i) => {
                        const details =
                          error.name === 'ValidationError' ? error.errors : error.details;
                        const name =
                          error.name === 'ValidationError' ? error.value.name : error.name;
                        return (
                          <ErrorsCol key={`${name}-error-${i}`} marginBottom="16px">
                            <ErrorsRow>
                              <ErrorLabel>Name: </ErrorLabel>
                              <ErrorText>{name}</ErrorText>
                            </ErrorsRow>
                            <ErrorsRow>
                              <ErrorLabel>Errors: </ErrorLabel>
                              <ErrorsCol>
                                {details.map((detail, j) => (
                                  <ErrorText key={`${name}-error-${i}-${j}`}>{detail}</ErrorText>
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
                css={working ? closeIconDisabled : closeIcon}
                onClick={() => {
                  if (working) {
                    return;
                  }

                  setWorking(true);
                  clearNotification(notification.id);
                  setWorking(false);
                }}
              />
            )}
          </Notification>
        ))}
        {notifications.length > NOTIFICATION_LIMIT && (
          <ShowHideButton onClick={() => setShowMore(!showMore)}>
            <PlusMinusIcon showMore={showMore}>
              {showMore ? '-' : '+'}
            </PlusMinusIcon>
            <ShowHideButtonLabel>
              {`${showMore ? 'Hide' : 'Show'} ${notifications.length - NOTIFICATION_LIMIT} ${
                showMore
                  ? notifications.length - NOTIFICATION_LIMIT === 1 ? 'notification' : 'notifications'
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
