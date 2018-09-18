import React from 'react';
import Component from 'react-component-component';

import { fetchData } from '../services/Fetcher';
import {
  uploadModelsFromSheet,
  extractResultText,
  extractErrorText,
  generateTableActions,
} from '../helpers';

import { NotificationsContext } from '../Notifications';

export const ModelManagerContext = React.createContext();

const paginatedUrl = ({ baseUrl, page, pageSize }) =>
  baseUrl + `?skip=${0}&limit=${page * pageSize + pageSize}`;

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
    url: baseUrl + `/count`,
    data: '',
    method: 'get',
  });

  return [await getData, await getCount];
};

export default ({ baseUrl, children, ...props }) => (
  <NotificationsContext>
    {({ appendNotification }) => (
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
            const [dataResponse, countResponse] = await loadData(baseUrl, state);
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
          if (state.pageSize !== prevState.pageSize || state.page !== prevState.page) {
            try {
              const [dataResponse, countResponse] = await loadData(baseUrl, state);
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
        {({ state, setState }) => (
          <ModelManagerContext.Provider
            value={{
              state,
              uploadModelsFromSheet: async (sheetURL, overwrite) => {
                // Set loading true (lock UI)
                await setState(() => ({
                  ...state,
                  isLoading: true,
                }));

                uploadModelsFromSheet(sheetURL, overwrite)
                  .then(({ data: { result } }) =>
                    loadData(baseUrl, state).then(async ([dataResponse, countResponse]) => {
                      await setState(() => ({
                        isLoading: false,
                        data: dataResponse.data,
                        error: null,
                        rowCount: countResponse.data.count,
                      }));

                      await appendNotification({
                        type: 'success',
                        message: 'Model Upload Complete',
                        details: extractResultText(result),
                      });
                    }),
                  )
                  .catch(async err => {
                    const errorText = extractErrorText(err);
                    debugger;

                    await setState(() => ({
                      ...state,
                      isLoading: false,
                    }));

                    await appendNotification({
                      type: 'error',
                      message: 'Model Upload Error.',
                      details: errorText.length > 0 ? errorText : 'Unknown error has occured.',
                    });
                  });
              },
              ...generateTableActions(state, setState, state.data),
            }}
            {...props}
          >
            {children}
          </ModelManagerContext.Provider>
        )}
      </Component>
    )}
  </NotificationsContext>
);
