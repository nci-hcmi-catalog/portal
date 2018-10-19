import React from 'react';
import ReactTable from 'react-table';
import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';

import searchStyles from 'theme/searchStyles';
import checkboxHOC from 'react-table/lib/hoc/selectTable';

const EnhancedReactTable = checkboxHOC(ReactTable);

const defaultFilterFunc = (cellValue, filterValue) =>
  `${cellValue}`.toLowerCase().includes(filterValue.toLowerCase());

const commonDataTableProps = ({
  state,
  state: { isLoading, data, selection, filterValue },
  tableColumns,
  toggleSelection,
  toggleAll,
  defaultSortColId,
}) => ({
  minRows: 0,
  loading: isLoading,
  columns: tableColumns,
  defaultSorted: [
    {
      id: defaultSortColId || 'updatedAt',
      desc: true,
    },
  ],
  multiSort: false,
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
  state: { rowCount, data, pageSize, page },
  onPageChange,
  onPageSizeChange,
  ...props
}) => (
  <TableComponent
    {...commonDataTableProps({ state, ...props })}
    {...{
      data: data,
      showPagination: rowCount > pageSize,
      defaultPageSize: pageSize,
      pageSize: pageSize,
      page: page,
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
