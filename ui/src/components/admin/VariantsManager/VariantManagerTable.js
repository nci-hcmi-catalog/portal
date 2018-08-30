import React from 'react';
import { AdminTableProvider } from '../AdminTable/AdminTableController';
import { Col } from 'theme/system';
import AdminTableToolbar from '../AdminTable/AdminTableToolbar';
import EnhancedReactTable from '../AdminTable/EnhancedReactTable';
import { VariantTableColumns } from './VariantColumns';
import config from '../config';

export default () => (
  <AdminTableProvider baseUrl={`${config.urls.cmsBase}/Variant`}>
    <Col>
      <AdminTableToolbar {...{ type: `Variants` }} />
      <EnhancedReactTable {...{ tableColumns: VariantTableColumns }} />
      )}
    </Col>
  </AdminTableProvider>
);
