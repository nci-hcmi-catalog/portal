import React from 'react';
import Component from 'react-component-component';
import { Toolbar, DataTable } from '../AdminTable';
import { getUserTableColumns } from './UserTableColumns';
import { generateTableActions } from '../helpers';
import { Col } from 'theme/system';
import { fetchData } from '../services/Fetcher';
import { getPageData } from '../helpers/fetchTableData';

const type = 'Users';

const loadData = async (baseUrl, state) => {
  debugger;
  const getData = getPageData({
    baseUrl,
    ...state,
    tableColumns: getUserTableColumns({}),
  });
  const getCount = fetchData({
    url: `${baseUrl}/count`,
    data: '',
    method: 'get',
  });

  return [await getData, await getCount];
};

export default ({ isTableDataSynced, dataSyncCallback, baseUrl, deleteUser, saveUser }) => (
  <Component
    initialState={{
      minRows: 0,
      page: 0,
      pageSize: 10,
      scrollbarSize: {
        scrollbarWidth: 10,
      },
      filterValue: '',
      selection: [],
      selectAll: false,
      data: [],
      isLoading: false,
      error: null,
      rowCount: 0,
    }}
    didMount={async ({ state, setState }) => {
      try {
        const [dataResponse, countResponse] = await loadData(`${baseUrl}/User`, state);
        setState(() => ({
          isLoading: false,
          data: dataResponse.data,
          error: null,
          rowCount: countResponse.data.count,
        }));
      } catch (err) {
        setState(() => ({ isLoading: false, data: [], error: err }));
      }
    }}
    didUpdate={async ({ state, setState, prevState }) => {
      if (
        state.pageSize !== prevState.pageSize ||
        state.page !== prevState.page ||
        state.filterValue !== prevState.filterValue ||
        !isTableDataSynced
      ) {
        // do this before actual update calls because update calls will invoke another update on component and
        // this prop will still be true; that will cause it to execute below statements again.
        dataSyncCallback();
        try {
          const [dataResponse, countResponse] = await loadData(`${baseUrl}/User`, state);
          setState(() => ({
            isLoading: false,
            data: dataResponse.data,
            error: null,
            rowCount: countResponse.data.count,
          }));
        } catch (err) {
          setState(() => ({ isLoading: false, data: [], error: err }));
        }
      }
    }}
  >
    {({ state, setState }) => {
      const tableActions = generateTableActions(setState, state.data);
      return (
        <Col>
          <Toolbar
            {...{
              state,
              type,
              ...tableActions,
            }}
          />
          <DataTable
            {...{
              state,
              tableColumns: getUserTableColumns({ deleteUser, saveUser }),
              simpleTableWithPagination: true,
              ...tableActions,
            }}
          />
        </Col>
      );
    }}
  </Component>
);
//
