import React from 'react';
import { Link } from 'react-router-dom';

import { NotificationsToaster, Notification } from 'theme/adminNotificationStyles';

export default ({ notifications, clearNotification }) => (
  <NotificationsToaster>
    {notifications.map(notification => (
      <Notification key={notification.id}>
        {notification.message}
        {notification.details && <div>notification.details</div>}
        {notification.link && <Link to={notification.link}>{notification.linkText || 'Link'}</Link>}
        <div onClick={() => clearNotification(notification.id)}>Clear</div>
      </Notification>
    ))}
  </NotificationsToaster>
);
