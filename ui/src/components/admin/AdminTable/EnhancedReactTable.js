import React from 'react';
import ReactTable from 'react-table';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';
import searchStyles from 'theme/searchStyles';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import { AdminTableContext } from './AdminTableController';

const EnhancedReactTable = checkboxHOC(ReactTable);

export default ({ tableColumns }) => (
  <AdminTableContext.Consumer>
    {({ state, onPageChange, onPageSizeChange }) => {
      const { isLoading, page, pageSize, data, rowCount } = state;
      return (
        <div css={searchStyles}>
          <EnhancedReactTable
            minRows={pageSize}
            loading={isLoading}
            columns={tableColumns}
            data={data}
            showPagination={rowCount > 10}
            className={`-striped -highlight`}
            defaultPageSize={pageSize}
            pageSize={pageSize}
            page={page}
            PaginationComponent={() => (
              <CustomPagination
                {...state}
                {...{
                  pages: rowCount / pageSize,
                  showPageSizeOptions: true,
                  pageSizeOptions: [10, 20, 50, 100],
                  showPageJump: rowCount > pageSize,
                  canPrevious: true,
                  canNext: true,
                  maxPagesOptions: 10,
                  onPageChange: onPageChange,
                  onPageSizeChange: onPageSizeChange,
                }}
              />
            )}
            onPageChange={onPageChange}
            {...{ selectAll: state.selectAll, selectType: 'checkbox' }}
          />
        </div>
      );
    }}
  </AdminTableContext.Consumer>
);
