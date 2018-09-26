import React from 'react';
import { withRouter } from 'react-router';
import Component from 'react-component-component';

export const NotificationsContext = React.createContext();

const generateNotification = (notification, state, setState, history) => {
  const id = Date.now();
  const timeout = 'timeout' in notification ? notification.timeout : 3000; // default value is 10 seconds, can be overwritten or turned off (false)

  // Create the clear function for this notification
  const clearThisNotification = () => {
    // Removes the notification from state
    setState(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id),
    }));

    // releases the navigation listener
    unlisten();
    // clears the timout function
    window.clearTimeout(notificationTimeout);
  };

  // Attach a listener to clear this notification on navigation
  // (clears the notification when navigating to a different page)
  const unlisten = history.listen(() => {
    clearThisNotification();
  });

  // If the notification has a timeout (default)
  // On timeout will clear the notification
  const notificationTimeout =
    timeout &&
    setTimeout(() => {
      clearThisNotification();
    }, timeout);

  return {
    ...notification,
    id,
    clear: clearThisNotification,
  };
};

// Provider
const NotificationsProvider = ({ children, history }) => (
  <Component
    initialState={{
      notifications: [],
    }}
  >
    {({ state, setState }) => (
      <NotificationsContext.Provider
        value={{
          state: state,
          appendNotification: notification => {
            setState({
              notifications: [
                ...state.notifications,
                // Generating a notification also creates the clear function
                // which requires we pass state, setState, history in addition
                // to the notification itself
                generateNotification(notification, state, setState, history),
              ],
            });
          },
          clearNotification: id =>
            // Clearing a notification from the outside means finding the correct
            // notification object and executing its' clear function
            state.notifications.find(notification => notification.id === id).clear(),
        }}
      >
        {children}
      </NotificationsContext.Provider>
    )}
  </Component>
);

export default withRouter(NotificationsProvider);
