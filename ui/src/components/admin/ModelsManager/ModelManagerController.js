import React from 'react';
import Component from 'react-component-component';

import {
  uploadModelsFromSheet,
  extractResultText,
  extractErrorText,
  generateTableActions,
  bulkAction,
  singleAction,
} from '../helpers';

import { getPageData, getCountData } from '../helpers/fetchTableData';
import { ModelTableColumns } from './ModelColumns';
import { NotificationsContext } from '../Notifications';
import { debounce } from 'lodash';

export const ModelManagerContext = React.createContext();

const loadData = async (baseUrl, state) => {
  const getData = getPageData({
    baseUrl,
    ...state,
    tableColumns: ModelTableColumns,
  });
  const getCount = getCountData({
    baseUrl: `${baseUrl}/count`,
    ...state,
    tableColumns: ModelTableColumns,
  });

  return [await getData, await getCount];
};

const initPagingState = {
  page: 0,
  filterValue: '',
  selection: [],
  selectAll: false,
  sorted: {
    id: 'updatedAt',
    desc: true,
  },
};

const bulkActionCreator = ({
  action,
  baseUrl,
  state,
  setState,
  appendNotification,
}) => async () => {
  if (state.selection.length === 0) {
    return console.error('Cannot publish a null selection');
  }

  // Set loading true (lock UI)
  await setState({ isLoading: true });

  bulkAction(action, state.selection)
    .then(({ data: { success, errors } }) =>
      loadData(baseUrl, state).then(async ([dataResponse, countResponse]) => {
        await setState(() => ({
          isLoading: false,
          data: dataResponse.data,
          error: null,
          rowCount: countResponse.data.count,
          ...initPagingState,
        }));

        await appendNotification({
          type: action === 'publish' && errors.length > 0 ? 'warning' : 'success',
          message: `Bulk ${action} complete.`,
          details:
            success +
            (action === 'publish' && errors.length > 0
              ? `. ${errors.length} error${errors.length > 1 ? 's' : ''} detected.`
              : ''),
          bulkErrors: action === 'publish' && errors.length > 0 && errors,
          timeout: action === 'publish' && errors.length > 0 ? false : 10000, // do not auto-remove this notification when bulk publishing
        });
      }),
    )
    .catch(async err => {
      const errorText = extractErrorText(err);

      await setState({
        isLoading: false,
        selection: [],
        selectAll: false,
      });

      await appendNotification({
        type: 'error',
        message: `Bulk ${action} error.`,
        details: errorText.length > 0 ? errorText : 'Unknown error has occurred.',
      });
    });
};

/*
Model table state transitions for each action:
1. Any successful bulk action (Publish/Unpublish/Delete) should reset filter, sort and page #
2. Bulk upload should reset filter, sort and page #
2. Individual model publish/unpublish/delete should not reset filter, sort and page #
*/
export default ({ baseUrl, cmsBase, children, ...props }) => (
  <NotificationsContext>
    {({ appendNotification }) => (
      <Component
        initialState={{
          minRows: 0,
          pageSize: 20,
          scrollbarSize: {
            scrollbarWidth: 10,
          },
          filterValue: '',
          data: [],
          isLoading: false,
          error: null,
          rowCount: 0,
          ...initPagingState,
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
        // only debounce data load on updates -- this is primarily to prevent too many data fetches as user is filtering the table
        didUpdate={debounce(
          async ({ state, setState, prevState }) => {
            if (
              state.pageSize !== prevState.pageSize ||
              state.page !== prevState.page ||
              state.filterValue !== prevState.filterValue ||
              state.sorted !== prevState.sorted
            ) {
              try {
                setState({
                  isLoading: true,
                  data: [],
                  error: null,
                  rowCount: 0,
                });
                const [dataResponse, countResponse] = await loadData(baseUrl, state);
                setState(() => ({
                  isLoading: false,
                  data: dataResponse.data,
                  error: null,
                  rowCount: countResponse.data.count,
                  selection: [],
                  selectAll: false,
                }));
              } catch (err) {
                setState(() => ({ isLoading: false, data: [], error: err }));
              }
            }
          },
          300,
          { maxWait: 1000, trailing: true },
        )}
      >
        {({ state, setState }) => (
          <ModelManagerContext.Provider
            value={{
              state,
              uploadModelsFromSheet: async (sheetURL, overwrite) => {
                // Set loading true (lock UI)
                await setState({
                  isLoading: true,
                });

                uploadModelsFromSheet(sheetURL, overwrite)
                  .then(({ data: { result } }) =>
                    loadData(baseUrl, state).then(async ([dataResponse, countResponse]) => {
                      await setState({
                        isLoading: false,
                        data: dataResponse.data,
                        error: null,
                        rowCount: countResponse.data.count,
                        ...initPagingState,
                      });

                      await appendNotification({
                        type: result.errors.length > 0 ? 'warning' : 'success',
                        message: 'Model Upload Complete',
                        details: extractResultText(result),
                        bulkErrors: result.errors,
                        timeout: false, // do not auto-remove this notification
                      });
                    }),
                  )
                  .catch(async err => {
                    const errorText = extractErrorText(err);

                    await setState({
                      isLoading: false,
                    });

                    await appendNotification({
                      type: 'error',
                      message: 'Model Upload Error.',
                      details: errorText.length > 0 ? errorText : 'Unknown error has occurred.',
                    });
                  });
              },
              bulkPublish: bulkActionCreator({
                action: 'publish',
                baseUrl,
                state,
                setState,
                appendNotification,
              }),
              bulkUnpublish: bulkActionCreator({
                action: 'unpublish',
                baseUrl,
                state,
                setState,
                appendNotification,
              }),
              bulkDelete: bulkActionCreator({
                action: 'delete',
                baseUrl,
                state,
                setState,
                appendNotification,
              }),
              publishOne: async name => {
                // Set loading true (lock UI)
                await setState({
                  isLoading: true,
                });

                singleAction('publish', name)
                  .then(() => loadData(baseUrl, state))
                  .then(async ([dataResponse, countResponse]) => {
                    await setState({
                      isLoading: false,
                      data: dataResponse.data,
                      error: null,
                      rowCount: countResponse.data.count,
                    });

                    await appendNotification({
                      type: 'success',
                      message: `Publish Successful!`,
                      details: `${name} has been successfully published. View it live here: `,
                      link: `/model/${name}`,
                      linkText: name,
                    });
                  })
                  .catch(async err => {
                    const errorText = extractErrorText(err);

                    await setState({
                      isLoading: false,
                      error: err,
                    });

                    await appendNotification({
                      type: 'error',
                      message: `Publish Error.`,
                      details: errorText.length > 0 ? errorText : 'Unknown error has occurred.',
                    });
                  });
              },
              unpublishOne: async name => {
                // Set loading true (lock UI)
                await setState({
                  isLoading: true,
                });

                singleAction('unpublish', name)
                  .then(() => loadData(baseUrl, state))
                  .then(async ([dataResponse, countResponse]) => {
                    await setState(() => ({
                      isLoading: false,
                      data: dataResponse.data,
                      error: null,
                      rowCount: countResponse.data.count,
                    }));

                    await appendNotification({
                      type: 'success',
                      message: `Unpublish Successful!`,
                      details: `${name} has been successfully unpublished`,
                    });
                  })
                  .catch(async err => {
                    const errorText = extractErrorText(err);

                    await setState({
                      isLoading: false,
                      error: err,
                    });

                    await appendNotification({
                      type: 'error',
                      message: `Unpublish Error.`,
                      details: errorText.length > 0 ? errorText : 'Unknown error has occurred.',
                    });
                  });
              },
              deleteOne: async name => {
                // Set loading true (lock UI)
                await setState({ isLoading: true });

                singleAction('delete', name)
                  .then(() => loadData(baseUrl, state))
                  .then(async ([dataResponse, countResponse]) => {
                    await setState(() => ({
                      isLoading: false,
                      data: dataResponse.data,
                      error: null,
                      rowCount: countResponse.data.count,
                    }));

                    await appendNotification({
                      type: 'success',
                      message: `Delete Successful!`,
                      details: `${name} has been successfully deleted`,
                    });
                  })
                  .catch(async err => {
                    const errorText = extractErrorText(err);

                    await setState({
                      isLoading: false,
                      error: err,
                    });

                    await appendNotification({
                      type: 'error',
                      message: `Delete Error.`,
                      details: errorText.length > 0 ? errorText : 'Unknown error has occurred.',
                    });
                  });
              },
              ...generateTableActions(setState, state.data),
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
