import React from 'react';
import { withRouter } from 'react-router';
import Component from 'react-component-component';

export const NotificationsContext = React.createContext();

const generateNotification = notification => ({
  ...notification,
  id: new Date().valueOf(),
});

// Provider
const NotificationsProvider = ({ children, history }) => (
  <Component
    initialState={{
      notifications: [],
    }}
    didMount={({ setState }) => {
      // This will be called to unsubscribe
      // the listener on willUnmount
      let unlisten;

      // Listen to history changes and immediately clear
      // notifications then unmount
      unlisten = history.listen(() => {
        unlisten();
        setState({
          notifications: [],
        });
      });
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
      >
        {children}
      </NotificationsContext.Provider>
    )}
  </Component>
);

export default withRouter(NotificationsProvider);
