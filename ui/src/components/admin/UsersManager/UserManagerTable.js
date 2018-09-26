import React from 'react';

import { ModelManagerContext } from '../ModelsManager/ModelManagerController';
import { Toolbar, DataTable } from '../AdminTable';
import { UserTableColumns } from './UserTableColumns';

import { Col } from 'theme/system';

const type = 'Users';

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
            tableColumns: UserTableColumns,
            onPageChange,
            onPageSizeChange,
            toggleSelection,
            toggleAll,
            simpleTableWithPagination: true,
          }}
        />
      </Col>
    )}
  </ModelManagerContext.Consumer>
);
