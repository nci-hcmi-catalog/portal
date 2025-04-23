/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import ReactTable from 'react-table';
import { Table, TableContextProvider, Pagination } from '@overture-stack/arranger-components';
// import CustomPagination from '@arranger/components/dist/DataTable/Table/CustomPagination';
// import EnhancedReactTable from '@arranger/components/dist/DataTable/Table/EnhancedReactTable';

import searchStyles from 'theme/searchStyles';

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
          (row) =>
            // filter only based on visible columns
            tableColumns.filter((tableCol) =>
              // apply each column's filter or a default filter if col filter is not defined
              (tableCol.filter || defaultFilterFunc)(row[tableCol.accessor], filterValue),
            ).length > 0,
        ),
  showPagination: false,
  className: `-striped -highlight`,
  toggleSelection: toggleSelection,
  toggleAll: toggleAll,
  isSelected: (id) => selection.indexOf(id) !== -1,
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
  storageKey,
  ...props
}) => {
  useEffect(() => {
    const storedPageSize = pageSizeFromStorage(storageKey);
    const pageSize = storedPageSize ? parseInt(storedPageSize) : state.pageSize || 10;
    onPageSizeChange(pageSize);
  }, []);
  return (
    <TableComponent
      {...commonDataTableProps({ state, onSortedChange, ...props })}
      {...{
        data: data,
        showPagination: true,
        defaultPageSize: pageSize,
        pageSize,
        // there is no page property for the table. Table always displays single page of data coming from server
        // paging component is responsible for keeping track of the page # (offset) of server data
        PaginationComponent: () => (
          <></>
          // <CustomPagination
          //   {...state}
          //   {...{
          //     pageSize,
          //     pages: Math.ceil(rowCount / pageSize),
          //     showPageSizeOptions: true,
          //     pageSizeOptions: [10, 20, 50, 100],
          //     showPageJump: rowCount > pageSize,
          //     canPrevious: true,
          //     canNext: true,
          //     maxPagesOptions: 10,
          //     onPageChange: onPageChange,
          //     onPageSizeChange: pageSizeChangeHandler(onPageSizeChange, storageKey),
          //   }}
          // />
        ),
        onPageChange: onPageChange,
      }}
    />
  );
};
const storageKeyTemplate = (key) => `datatable-${key}-pagesize`;
const pageSizeChangeHandler = (externalHandler, key) => (size) => {
  if (key) {
    window.sessionStorage.setItem(storageKeyTemplate(key), size);
  }
  externalHandler(size);
};
const pageSizeFromStorage = (storageKey) => {
  return storageKey ? window.sessionStorage.getItem(storageKeyTemplate(storageKey)) : undefined;
};

const DataTable = ({
  simpleTableWithPagination,
  disablePagination,
  onPageSizeChange,
  storageKey,
  ...props
}) => {
  // let TableComponent = simpleTableWithPagination ? ReactTable : <></>;
  //EnhancedReactTable;
  return (
    <div css={searchStyles}>
      <TableContextProvider>
        <Table />
        {disablePagination ? null : <Pagination />}
        {/* {disablePagination ? (
          <TableWithoutPagination {...{ TableComponent }} {...props} />
          ) : (
            <TableWithPagination {...{ TableComponent, onPageSizeChange, storageKey }} {...props} />
            )} */}
      </TableContextProvider>
    </div>
  );
};

export default DataTable;

export const GenomicDataTable = ({
  state,
  onPageChange,
  onPageSizeChange,
  storageKey,
  ...props
}) => {
  const storedPageSize = pageSizeFromStorage(storageKey);
  const pageSize = storedPageSize ? parseInt(storedPageSize) : state.pageSize || 10;
  return (
    <div css={searchStyles}>
      <ReactTable
        {...commonDataTableProps({ state, onSortedChange: state.onSortedChange, ...props })}
        {...{
          showPagination: true,
          defaultPageSize: 10,
          pageSize,
          page: state.page,
          PaginationComponent: () => (
            <></>
            // <CustomPagination
            //   {...state}
            //   {...{
            //     pageSize,
            //     pages: Math.ceil(state.rowCount / state.pageSize),
            //     showPageSizeOptions: true,
            //     pageSizeOptions: [10, 20, 50, 100],
            //     showPageJump: state.rowCount > state.pageSize,
            //     canPrevious: true,
            //     canNext: true,
            //     maxPagesOptions: 10,
            //     onPageChange: onPageChange,
            //     onPageSizeChange: pageSizeChangeHandler(onPageSizeChange, storageKey),
            //   }}
            // />
          ),
        }}
      />
    </div>
  );
};
