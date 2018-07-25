import React from 'react';
import { Row, Col } from 'theme/system';
import { Route } from 'react-router-dom';

import AdminNav from './AdminNav';
import ModelsManager from './ModelsManager';
import ModelUploadSingle from './ModelUploadSingle';
import UsersManage from './UsersManage';

export default ({ location }) => (
  <Col>
    <AdminNav location={location} />{' '}
    <Row>
      <Route path="/admin/manage-users" render={() => <UsersManage />} />{' '}
      <Route path="/admin/manage-models" render={() => <ModelsManager />} />{' '}
      <Route path="/admin/single-model-upload" render={() => <ModelUploadSingle />} />{' '}
    </Row>{' '}
  </Col>
);
