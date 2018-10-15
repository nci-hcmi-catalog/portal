import React from 'react';
import ReactTable from 'react-table';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';

import searchStyles from 'theme/searchStyles';
import checkboxHOC from 'react-table/lib/hoc/selectTable';

const EnhancedReactTable = checkboxHOC(ReactTable);

export default ({
  state,
  state: { isLoading, page, pageSize, data, rowCount, selection, filterValue },
  tableColumns,
  onPageChange,
  onPageSizeChange,
  toggleSelection,
  toggleAll,
  simpleTableWithPagination,
}) => {
  let TableComponent = simpleTableWithPagination ? ReactTable : EnhancedReactTable;
  return (
    <div css={searchStyles}>
      <TableComponent
        minRows={0}
        loading={isLoading}
        columns={tableColumns}
        data={
          filterValue === ''
            ? data
            : data.filter(
                d =>
                  Object.values(d)
                    .filter(d => typeof d === 'string')
                    .map(d => d.toLowerCase().includes(state.filterValue.toLowerCase()))
                    .filter(v => v).length > 0,
              )
        }
        showPagination={rowCount > 10}
        className={`-striped -highlight`}
        defaultPageSize={pageSize}
        pageSize={pageSize}
        page={page}
        toggleSelection={toggleSelection}
        toggleAll={toggleAll}
        isSelected={id => selection.indexOf(id) !== -1}
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
};
