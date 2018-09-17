import React from 'react';

import { ModelManagerContext } from './ModelManagerController';
import { Toolbar, DataTable } from '../AdminTable';
import { ModelTableColumns } from './ModelColumns';

import { Col } from 'theme/system';

const type = 'Models';

export default () => (
  <ModelManagerContext.Consumer>
    {({ state, onPageChange, onPageSizeChange, onFilterValueChange }) => (
      <Col>
        <Toolbar {...{ state, type, onFilterValueChange }} />
        <DataTable
          {...{ state, tableColumns: ModelTableColumns, onPageChange, onPageSizeChange }}
        />
      </Col>
    )}
  </ModelManagerContext.Consumer>
);
