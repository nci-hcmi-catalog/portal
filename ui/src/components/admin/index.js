import React from 'react';
import { Row, Col } from 'theme/system';
import { Route, Link } from 'react-router-dom';

import AdminNav from './AdminNav';
import ModelsManage from './ModelsManage';
import ModelUploadBulk from './ModelUploadBulk';
import ModelUploadSingle from './ModelUploadSingle';
import UsersManage from './UsersManage';

export default () => (
  <Col>
    <Row>
      <Row p={15}>
        <Link to="/">« Back to List View</Link>
      </Row>
      <Row flex={1} p={15}>
        HCMI Searchable Catalog Administration
      </Row>
      <Row p={15}>Logout</Row>
    </Row>
    <Row>
      <AdminNav />
    </Row>
    <Row>
      <Route path="/admin/manage-users" render={() => <UsersManage />} />
      <Route path="/admin/manage-models" render={() => <ModelsManage />} />
      <Route path="/admin/single-model-upload" render={() => <ModelUploadSingle />} />
    </Row>
  </Col>
);
