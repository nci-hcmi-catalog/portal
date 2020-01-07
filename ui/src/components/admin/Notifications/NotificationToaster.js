import React from 'react';
import Component from 'react-component-component';
import { scroller } from 'react-scroll';

import { NotificationsContext } from './NotificationsController';

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
import AdminCloseIcon from 'icons/AdminCloseIcon';

const scrollIntoView = () =>
  scroller.scrollTo('notifications-toaster', {
    duration: 500,
    smooth: true,
    offset: -20,
  });

export default () => (
  <NotificationsContext.Consumer>
    {({ state: { notifications }, clearNotification }) => (
      <Component
        didMount={() => {
          // Scroll to top on initial load of notifications component
          scrollIntoView();
        }}
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
                <MessageLink to={notification.link} type={notification.type}>
                  {notification.linkText || 'Link'}
                </MessageLink>
              )}
              <AdminCloseIcon
                style={closeIcon}
                onClick={() => clearNotification(notification.id)}
              />
            </Notification>
          ))}
        </NotificationsToaster>
      </Component>
    )}
  </NotificationsContext.Consumer>
);
