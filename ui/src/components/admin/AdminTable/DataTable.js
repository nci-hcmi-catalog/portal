import React from 'react';
import ReactTable from 'react-table';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';
import checkboxHOC from '@arranger/components/dist/DataTable/Table/checkboxHOC';

import searchStyles from 'theme/searchStyles';

const EnhancedReactTable = checkboxHOC(ReactTable);

const defaultFilterFunc = (cellValue, filterValue) =>
  `${cellValue}`.toLowerCase().includes(filterValue.toLowerCase());

const commonDataTableProps = ({
  state,
  state: { isLoading, data, selection, filterValue, sorted },
  onSortedChange,
  tableColumns,
  toggleSelection,
  toggleAll,
}) => ({
  minRows: 0,
  loading: isLoading,
  columns: tableColumns,
  defaultSorted: [
    sorted || {
      id: 'updatedAt',
      desc: true,
    },
  ],
  multiSort: false,
  onSortedChange,
  data:
    filterValue === ''
      ? data
      : data.filter(
          row =>
            // filter only based on visible columns
            tableColumns.filter(tableCol =>
              // apply each column's filter or a default filter if col filter is not defined
              (tableCol.filter || defaultFilterFunc)(row[tableCol.accessor], filterValue),
            ).length > 0,
        ),
  showPagination: false,
  className: `-striped -highlight`,
  toggleSelection: toggleSelection,
  toggleAll: toggleAll,
  isSelected: id => selection.indexOf(id) !== -1,
  ...{ selectAll: state.selectAll, selectType: 'checkbox' },
});

const TableWithoutPagination = ({ TableComponent, ...props }) => (
  <TableComponent {...commonDataTableProps(props)} />
);

const TableWithPagination = ({
  TableComponent,
  state,
  state: { rowCount, data, pageSize },
  onPageChange,
  onPageSizeChange,
  onSortedChange,
  ...props
}) => (
  <TableComponent
    {...commonDataTableProps({ state, onSortedChange, ...props })}
    {...{
      data: data,
      showPagination: true,
      defaultPageSize: pageSize,
      pageSize: pageSize,
      // there is no page property for the table. Table always displays single page of data coming from server
      // paging component is responsible for keeping track of the page # (offset) of server data
      PaginationComponent: () => (
        <CustomPagination
          {...state}
          {...{
            pages: Math.ceil(rowCount / pageSize),
            showPageSizeOptions: true,
            pageSizeOptions: [20, 50, 100],
            showPageJump: rowCount > pageSize,
            canPrevious: true,
            canNext: true,
            maxPagesOptions: 10,
            onPageChange: onPageChange,
            onPageSizeChange: onPageSizeChange,
          }}
        />
      ),
      onPageChange: onPageChange,
    }}
  />
);

export default ({ simpleTableWithPagination, disablePagination, ...props }) => {
  let TableComponent = simpleTableWithPagination ? ReactTable : EnhancedReactTable;
  return (
    <div css={searchStyles}>
      {disablePagination ? (
        <TableWithoutPagination {...{ TableComponent }} {...props} />
      ) : (
        <TableWithPagination {...{ TableComponent }} {...props} />
      )}
    </div>
  );
};

export const GenomicDataTable = ({ state, onPageChange, onPageSizeChange, ...props }) => {
  return (
    <div css={searchStyles}>
      <ReactTable
        {...commonDataTableProps({ state, onSortedChange: state.onSortedChange, ...props })}
        {...{
          showPagination: true,
          defaultPageSize: state.pageSize,
          pageSize: state.pageSize,
          page: state.page,
          PaginationComponent: () => (
            <CustomPagination
              {...state}
              {...{
                pages: Math.ceil(state.rowCount / state.pageSize),
                showPageSizeOptions: true,
                pageSizeOptions: [10, 20, 50, 100],
                showPageJump: state.rowCount > state.pageSize,
                canPrevious: true,
                canNext: true,
                maxPagesOptions: 10,
                onPageChange: onPageChange,
                onPageSizeChange: onPageSizeChange,
              }}
            />
          ),
        }}
      />
    </div>
  );
};
