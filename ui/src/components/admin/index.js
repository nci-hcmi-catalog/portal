import React from 'react';

import AdminView from './AdminView';

import { NotificationsProvider, PublishNotificationsProvider } from './Notifications';
import { LoggedInUserProvider } from '@hcmi-portal/ui/src/components/admin/services/LoggedInUser';
import { VariantsProvider } from 'providers/Variants';

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
