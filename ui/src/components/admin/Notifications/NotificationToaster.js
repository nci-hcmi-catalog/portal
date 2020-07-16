import React from 'react';
import Component from 'react-component-component';
import { scroller } from 'react-scroll';
import Spinner from 'react-spinkit';

import { NotificationsContext } from './NotificationsController';
import { NOTIFICATION_TYPES } from './../Notifications';

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
} from 'theme/adminNotificationStyles';
import { Col } from 'theme/system';
import base from 'theme';

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

export default () => (
  <NotificationsContext.Consumer>
    {({ state: { notifications }, clearNotification }) => (
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
          {notifications.map(notification => (
            <Notification key={notification.id} type={notification.type}>
              {renderIcon(notification.type)}
              <Col>
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
                  <MessageLink to={notification.link} type={notification.type} target="_blank">
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
        </NotificationsToaster>
      </Component>
    )}
  </NotificationsContext.Consumer>
);
