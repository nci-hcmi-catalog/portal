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
      <Route path="/admin/manage_users" render={() => <UsersManage />} />
      <Route path="/admin/single_model_upload" render={() => <ModelUploadSingle />} />
      <Route path="/admin/bulk_model_upload" render={() => <ModelUploadBulk />} />
      <Route path="/admin/manage_models" render={() => <ModelsManage />} />
    </Row>
  </Col>
);
