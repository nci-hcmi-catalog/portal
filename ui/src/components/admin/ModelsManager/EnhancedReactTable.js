import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { columns } from './ModelColumns';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';
import searchStyles from 'theme/searchStyles';
import checkboxHOC from 'react-table/lib/hoc/selectTable';
import { ModelsTableContext } from './ModelsTableController';

const EnhancedReactTable = checkboxHOC(ReactTable);

export default props => (
  <ModelsTableContext.Consumer>
    {({ state, onPageChange }) => {
      const { isLoading, page, pageSize, data, rowCount, defaultPageSize } = state;
      return (
        <div css={searchStyles}>
          <EnhancedReactTable
            minRows={0}
            loading={isLoading}
            columns={columns}
            data={data}
            showPagination={rowCount > 10}
            className={`-striped -highlight`}
            defaultPageSize={defaultPageSize}
            page={page}
            PaginationComponent={props => (
              <CustomPagination
                {...state}
                {...{
                  pages: rowCount / pageSize,
                  showPageSizeOptions: false,
                  showPageJump: true,
                  canPrevious: true,
                  canNext: true,
                  maxPagesOptions: 10,
                  onPageChange: onPageChange,
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
