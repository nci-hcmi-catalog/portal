import React from 'react';
import { ModelsTableProvider } from './ModelsTableController';
import { Col } from 'theme/system';
import ModelsToolbar from './ModelsToolbar';
import EnhancedReactTable from './EnhancedReactTable';
import config from '../config';

export default props => (
  <ModelsTableProvider baseUrl={`${config.urls.modelBase}/Model`}>
    <Col>
      <ModelsToolbar />
      <EnhancedReactTable />
    </Col>
  </ModelsTableProvider>
);
