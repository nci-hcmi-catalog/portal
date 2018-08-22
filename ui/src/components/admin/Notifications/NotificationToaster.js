import React from 'react';

import {
  NotificationsToaster,
  Notification,
  Message,
  Details,
  MessageLink,
  closeIcon
} from 'theme/adminNotificationStyles';
import AdminCloseIcon from 'icons/AdminCloseIcon';

export default ({ notifications, clearNotification }) => (
  <NotificationsToaster>
    {notifications.map(notification => (
      <Notification key={notification.id} type={notification.type}>
        <Message>{notification.message}</Message>
        {notification.details && <Details>{notification.details}</Details>}
        {notification.link && (
          <MessageLink to={notification.link} type={notification.type}>
            {notification.linkText || 'Link'}
          </MessageLink>
        )}
        <AdminCloseIcon style={closeIcon} onClick={() => clearNotification(notification.id)} />
      </Notification>
    ))}
  </NotificationsToaster>
);
