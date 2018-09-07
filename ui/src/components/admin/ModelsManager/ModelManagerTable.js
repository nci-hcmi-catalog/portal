import React from 'react';
import { AdminTableProvider } from '../AdminTable/AdminTableController';
import { Col } from 'theme/system';
import AdminTableToolbar from '../AdminTable/AdminTableToolbar';
import EnhancedReactTable from '../AdminTable/EnhancedReactTable';
import { ModelTableColumns } from './ModelColumns';
import config from '../config';

export default () => (
  <AdminTableProvider baseUrl={`${config.urls.cmsBase}/Model`}>
    <Col>
      <AdminTableToolbar {...{ type: `Models` }} />
      <EnhancedReactTable {...{ tableColumns: ModelTableColumns }} />
    </Col>
  </AdminTableProvider>
);
