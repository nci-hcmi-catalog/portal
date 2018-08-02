import React from 'react';
import 'react-table/react-table.css';
import { ModelsTableProvider } from './ModelsTableController';
import { Col } from 'theme/system';
import ModelsToolbar from './ModelsToolbar';
import EnhancedReactTable from './EnhancedReactTable';

export default props => (
  <ModelsTableProvider baseUrl={'http://localhost:8080/api/v1/Model'}>
    <Col>
      <ModelsToolbar />
      <EnhancedReactTable />
    </Col>
  </ModelsTableProvider>
);
