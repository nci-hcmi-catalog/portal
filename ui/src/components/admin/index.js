import React from 'react';
import { Row, Col } from 'theme/system';
import { Route } from 'react-router-dom';

import AdminNav from './AdminNav';
import ModelsManage from './ModelsManage';
import ModelUploadSingle from './ModelUploadSingle';
import UsersManage from './UsersManage';

export default ({ location }) => (
  <Col>
    <AdminNav location={location} />
    <Row>
      <Route path="/admin/manage-users" render={() => <UsersManage />} />
      <Route path="/admin/manage-models" render={() => <ModelsManage />} />
      <Route path="/admin/model-upload-single" render={() => <ModelUploadSingle />} />
    </Row>
  </Col>
);
