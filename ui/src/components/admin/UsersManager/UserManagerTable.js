import React from 'react';
import Component from 'react-component-component';
import { Toolbar, DataTable } from '../AdminTable';
import { getUserTableColumns } from './UserTableColumns';
import { generateTableActions } from '../helpers';
import { Col } from 'theme/system';
import { fetchData } from '../services/Fetcher';

const type = 'Users';

const paginatedUrl = ({ baseUrl, page, pageSize }) =>
  `${baseUrl}?skip=${0}&limit=${page * pageSize + pageSize}`;

const getPageData = ({ baseUrl, page, pageSize }) => {
  let url = paginatedUrl({ baseUrl, page, pageSize });
  return fetchData({ url, data: '', method: 'get' });
};

const loadData = async (baseUrl, state) => {
  const getData = getPageData({
    baseUrl,
    ...state,
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
    didUpdate={async ({ state, setState }) => {
      if (!isTableDataSynced) {
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
      const tableActions = generateTableActions(state, setState, state.data);
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
