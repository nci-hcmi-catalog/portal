import React from 'react';
import { Route } from 'react-router-dom';

import AdminNav from './AdminNav';
import ModelsManage from './ModelsManage';
import ModelUploadSingle from './ModelUploadSingle';
import UsersManage from './UsersManage';
import { Col } from 'theme/system';
import { AdminWrapper } from 'theme/adminStyles';

export default ({ location }) => (
  <Col>
    <AdminNav location={location} />
    <AdminWrapper>
      <Route path="/admin/manage-users" render={() => <UsersManage />} />
      <Route path="/admin/manage-models" render={() => <ModelsManage />} />
      <Route path="/admin/model-upload-single" render={() => <ModelUploadSingle />} />
    </AdminWrapper>
  </Col>
);
