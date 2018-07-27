import React from 'react';
import { Route } from 'react-router-dom';

import AdminProvider from 'providers/AdminProvider';
import AdminNav from './AdminNav';
import ModelsManager from './ModelsManager';
import { ModelSingle } from './ModelUpload';
import UsersManage from './UsersManage';
import { Col } from 'theme/system';
import { AdminMain } from 'theme/adminStyles';

export default ({ location }) => (
  <AdminProvider>
    <Col>
      <AdminNav location={location} />
      <AdminMain>
        <Route path="/admin/manage-users" render={() => <UsersManage />} />
        <Route path="/admin/manage-models" render={() => <ModelsManager />} />
        <Route path="/admin/model-upload-single" render={() => <ModelSingle />} />
      </AdminMain>
    </Col>
  </AdminProvider>
);
