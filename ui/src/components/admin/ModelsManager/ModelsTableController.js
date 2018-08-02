import React from 'react';
import Component from 'react-component-component';
import { fetchData } from '../services/Fetcher';
export const ModelsTableContext = React.createContext();

const paginatedUrl = ({ baseUrl, page, pageSize }) =>
  baseUrl + `?skip=${page * pageSize}&limit=${pageSize}`;

export const ModelsTableProvider = ({ baseUrl, children, ...props }) => (
  <Component
    initialState={{
      minRows: 0,
      page: 0,
      pageSize: 5,
      scrollbarSize: {
        scrollbarWidth: 10,
      },
      defaultPageSize: 5,
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
        const url = paginatedUrl({
          baseUrl,
          ...state,
        });
        const getData = fetchData({ url, data: '', method: 'get' });
        const getCount = fetchData({
          url: baseUrl + `/count`,
          data: '',
          method: 'get',
        });
        const [dataResponse, countResponse] = [await getData, await getCount];
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
  >
    {({ state, setState }) => (
      <ModelsTableContext.Provider
        value={{
          state,
          onPageChange: newPage => setState({ page: newPage }),
          onFilterValueChange: newValue => setState({ filterValue: newValue }),
        }}
        {...props}
      >
        {children}
      </ModelsTableContext.Provider>
    )}
  </Component>
);
