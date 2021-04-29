import React from 'react';

import AdminView from './AdminView';

import { NotificationsProvider } from './Notifications';
import { LoggedInUserProvider } from '@hcmi-portal/ui/src/components/admin/services/LoggedInUser';
import { VariantsProvider } from 'providers/Variants';

export default ({ location }) => (
  <NotificationsProvider location={location}>
    <LoggedInUserProvider>
      <VariantsProvider>
        <AdminView location={location} />
      </VariantsProvider>
    </LoggedInUserProvider>
  </NotificationsProvider>
);
