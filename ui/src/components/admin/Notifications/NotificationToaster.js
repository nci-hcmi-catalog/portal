import React from 'react';
import { Link } from 'react-router-dom';

export default ({ notifications, clearNotification }) => (
  <div>
    {notifications.map(notification => (
      <div key={notification.id}>
        {notification.message}
        {notification.details && <div>notification.details</div>}
        {notification.link && <Link to={notification.link}>{notification.linkText || 'Link'}</Link>}
        <div onClick={() => clearNotification(notification.id)}>Clear</div>
      </div>
    ))}
  </div>
);
