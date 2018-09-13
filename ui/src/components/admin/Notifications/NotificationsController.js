import React from 'react';
import Component from 'react-component-component';
import { generateNotification } from '../helpers';

export const NotificationsContext = React.createContext();

// Provider
export const NotificationsProvider = ({ children, props }) => (
  <Component
    initialState={{
      notifications: [],
    }}
  >
    {({ state, setState }) => (
      <NotificationsContext.Provider
        value={{
          state: state,
          appendNotification: async notification =>
            await setState({
              notifications: [...state.notifications, generateNotification(notification)],
            }),
          clearNotification: id => {
            const notifications = state.notifications.filter(
              notification => notification.id !== id,
            );
            setState({
              ...state,
              notifications,
            });
          },
          loadNotifications: async notifications =>
            setState({
              notifications,
            }),
          clearAllNotifications: () =>
            setState({
              ...state,
              notifications: [],
            }),
        }}
        {...props}
      >
        {children}
      </NotificationsContext.Provider>
    )}
  </Component>
);

export default NotificationsProvider;
