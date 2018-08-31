import React from 'react';

import DataTable from './data-driven/DataTable';
import { AdminTableContext } from './AdminTableController';

export default ({ tableColumns }) => (
  <AdminTableContext.Consumer>
    {({ state, onPageChange, onPageSizeChange }) => (
      <DataTable {...{ state, tableColumns, onPageChange, onPageSizeChange }} />
    )}
  </AdminTableContext.Consumer>
);
