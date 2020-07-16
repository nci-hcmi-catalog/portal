import React from 'react';
import { Route } from 'react-router-dom';

import { NotificationsProvider } from './Notifications';

import AdminNav from './AdminNav';
import DataDictionary from './DataDictionary';
import ModelsManager from './ModelsManager';
import UsersManager from './UsersManager';
import { ModelSingle } from './Model';

import { AdminMain, AdminWrapper } from 'theme/adminStyles';
import { LoggedInUserProvider } from '@hcmi-portal/ui/src/components/admin/services/LoggedInUser';

export default ({ location }) => (
  <NotificationsProvider>
    <LoggedInUserProvider>
      <AdminWrapper>
        <AdminNav location={location} />
        <AdminMain>
          <Route exact path="/admin" component={ModelsManager} />
          <Route exact path="/admin/model/:name?" component={ModelSingle} />
          <Route exact path="/admin/manage-users" component={UsersManager} />
          <Route exact path="/admin/data-dictionary" component={DataDictionary} />
        </AdminMain>
      </AdminWrapper>
    </LoggedInUserProvider>
  </NotificationsProvider>
);
