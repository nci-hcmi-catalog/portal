import React from 'react';

import { ModelManagerContext } from './ModelManagerController';
import { Toolbar, DataTable } from '../AdminTable';
import { ModelTableColumns } from './ModelColumns';

import { Col } from 'theme/system';

const type = 'Models';

export default () => (
  <ModelManagerContext.Consumer>
    {({
      state,
      onPageChange,
      onPageSizeChange,
      onFilterValueChange,
      toggleSelection,
      toggleAll,
      bulkPublish,
      bulkUnpublish,
      bulkDelete,
    }) => (
      <Col>
        <Toolbar
          {...{
            state,
            type,
            onFilterValueChange,
            onPublishClick: bulkPublish,
            onUnpublishClick: bulkUnpublish,
            onDeleteClick: bulkDelete,
          }}
        />
        <DataTable
          {...{
            state,
            tableColumns: ModelTableColumns,
            onPageChange,
            onPageSizeChange,
            toggleSelection,
            toggleAll,
          }}
        />
      </Col>
    )}
  </ModelManagerContext.Consumer>
);
