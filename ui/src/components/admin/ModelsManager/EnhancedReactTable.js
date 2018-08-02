import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ModelTableColumns } from './ModelColumns';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';
import searchStyles from 'theme/searchStyles';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import { ModelsTableContext } from './ModelsTableController';

const EnhancedReactTable = checkboxHOC(ReactTable);

export default props => (
  <ModelsTableContext.Consumer>
    {({ state, onPageChange, onPageSizeChange }) => {
      const { isLoading, page, pageSize, data, rowCount } = state;
      return (
        <div css={searchStyles}>
          <EnhancedReactTable
            minRows={pageSize}
            loading={isLoading}
            columns={ModelTableColumns}
            data={data}
            showPagination={rowCount > 10}
            className={`-striped -highlight`}
            defaultPageSize={pageSize}
            pageSize={pageSize}
            page={page}
            PaginationComponent={props => (
              <CustomPagination
                {...state}
                {...{
                  pages: rowCount / pageSize,
                  showPageSizeOptions: true,
                  pageSizeOptions: [5, 20, 50, 100],
                  showPageJump: true,
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
  </ModelsTableContext.Consumer>
);
