import React from 'react';
import config from '../config';
import Component from 'react-component-component';
import { Toolbar, DataTable } from '../AdminTable';
import { UserTableColumns } from './UserTableColumns';
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

export default ({ isDataUpdated }) => (
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
        const [dataResponse, countResponse] = await loadData(`${config.urls.cmsBase}/User`, state);
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
      if (isDataUpdated) {
        try {
          const [dataResponse, countResponse] = await loadData(
            `${config.urls.cmsBase}/User`,
            state,
          );
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
              tableColumns: UserTableColumns,
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
