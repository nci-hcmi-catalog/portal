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
          if (props.notifications.length !== prevProps.notifications.length) {
            scrollIntoView();
          }
        }}
      >
        <NotificationsToaster name="notifications-toaster">
          {notifications.map(notification => (
            <Notification key={notification.id} type={notification.type}>
              <Message>{notification.message}</Message>
              {notification.details && <Details>{notification.details}</Details>}
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
