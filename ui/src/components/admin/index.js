import React from 'react';
import { Route } from 'react-router-dom';

import AdminNav from './AdminNav';
import ModelsManager from './ModelsManager';
import UsersManager from './UsersManager';
import { ModelSingle } from './Model';

import { Col } from 'theme/system';
import { AdminMain } from 'theme/adminStyles';

export default ({ location }) => (
  <Col>
    <AdminNav location={location} />
    <AdminMain>
      <Route path="/admin/manage-users" component={UsersManager} />
      <Route path="/admin/manage-models" component={ModelsManager} />
      <Route path="/admin/model/:name?" component={ModelSingle} />
    </AdminMain>
  </Col>
);
