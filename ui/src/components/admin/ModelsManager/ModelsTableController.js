import React from 'react';
import Component from 'react-component-component';
import { fetchData } from '../services/Fetcher';
export const ModelsTableContext = React.createContext();

const paginatedUrl = ({ baseUrl, page, pageSize }) =>
  baseUrl + `?skip=${page * pageSize}&limit=${pageSize}`;

const getPageData = ({ baseUrl, page, pageSize }) => {
  let url = paginatedUrl({ baseUrl, page, pageSize });
  return fetchData({ url, data: '', method: 'get' });
};
export const ModelsTableProvider = ({ baseUrl, children, ...props }) => (
  <Component
    initialState={{
      minRows: 0,
      page: 0,
      pageSize: 5,
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
        const getData = getPageData({
          baseUrl,
          ...state,
        });
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
    didUpdate={async ({ state, setState, prevState }) => {
      if (state.pageSize !== prevState.pageSize) {
        const newPageData = await getPageData({
          baseUrl,
          ...state,
        });
        setState({ isLoading: false, data: newPageData.data });
      }
    }}
  >
    {({ state, setState }) => (
      <ModelsTableContext.Provider
        value={{
          state,
          onPageChange: newPage => setState({ page: newPage }),
          onFilterValueChange: newValue => setState({ filterValue: newValue }),
          onPageSizeChange: newValue => setState({ pageSize: newValue, isLoading: true }),
        }}
        {...props}
      >
        {children}
      </ModelsTableContext.Provider>
    )}
  </Component>
);
