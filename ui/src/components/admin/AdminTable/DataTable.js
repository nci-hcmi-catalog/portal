import React from 'react';
import ReactTable from 'react-table';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';

import searchStyles from 'theme/searchStyles';
import checkboxHOC from 'react-table/lib/hoc/selectTable';

const EnhancedReactTable = checkboxHOC(ReactTable);

const defaultFilterFunc = (cellValue, filterValue) =>
  `${cellValue}`.toLowerCase().includes(filterValue.toLowerCase());

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
                row =>
                  // filter only based on visible columns
                  tableColumns.filter(tableCol =>
                    // apply each column's filter or a default filter if col filter is not defined
                    (tableCol.filter || defaultFilterFunc)(row[tableCol.accessor], filterValue),
                  ).length > 0,
              )
        }
        showPagination={rowCount > pageSize}
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
              pages: Math.ceil(rowCount / pageSize),
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
