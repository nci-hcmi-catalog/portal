import React from 'react';

import AdminView from './AdminView';

import { VariantsProvider } from '../../providers/Variants';
import { LoggedInUserProvider } from './services/LoggedInUser';
import { NotificationsProvider, PublishNotificationsProvider } from './Notifications';

const Admin = ({ location }) => (
  <NotificationsProvider location={location}>
    <PublishNotificationsProvider>
      <LoggedInUserProvider>
        <VariantsProvider>
          <AdminView location={location} />
        </VariantsProvider>
      </LoggedInUserProvider>
    </PublishNotificationsProvider>
  </NotificationsProvider>
);

export default Admin;
