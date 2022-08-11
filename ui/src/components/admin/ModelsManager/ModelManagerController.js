import React from 'react';
import Component from 'react-component-component';

import {
  uploadModelsFromSheet,
  extractResultText,
  extractErrorText,
  isEmptyResult,
  generateTableActions,
  bulkAction,
  singleAction,
} from '../helpers';

import { getPageData, getCountData } from '../helpers/fetchTableData';
import { publish, publishBulk } from '../Model/actions/Publish';
import { ModelTableColumns } from './ModelColumns';
import {
  NotificationsContext,
  NOTIFICATION_TYPES,
  PublishNotificationsContext,
} from '../Notifications';
import { debounce } from 'lodash';
import {
  importBulkGenomicVariants,
  auditGenomicVariantsSpecificModels,
} from '../Model/actions/GenomicVariants';
import { VARIANT_OVERWRITE_OPTIONS } from 'utils/constants';

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
          type:
            action === 'publish' && errors.length > 0
              ? NOTIFICATION_TYPES.WARNING
              : NOTIFICATION_TYPES.SUCCESS,
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
        type: NOTIFICATION_TYPES.ERROR,
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
const ModelManagerController = ({ baseUrl, cmsBase, children, ...props }) => (
  <NotificationsContext.Consumer>
    {({
      appendNotification,
      importProgress,
      setImportProgress,
      publishProgress,
      setPublishProgress,
    }) => (
      <PublishNotificationsContext.Consumer>
        {({ addPublishNotification, showErrorPublishNotification }) => (
          <Component
            initialState={{
              minRows: 0,
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
                  uploadModelsFromSheet: async (sheetURL, overwrite, overwriteVariants) => {
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
                          const anyUpdatesDone = isEmptyResult(result);
                          const notificationMessage = anyUpdatesDone
                            ? `No suitable data is available to upload. No changes were made.`
                            : `Bulk Upload of models has successfully completed. New models or updated fields are saved but not yet published.`;
                          await appendNotification({
                            type:
                              result.errors.length > 0
                                ? NOTIFICATION_TYPES.WARNING
                                : NOTIFICATION_TYPES.SUCCESS,
                            message: notificationMessage,
                            details: anyUpdatesDone ? '' : extractResultText(result),
                            bulkErrors: result.errors,
                            timeout: false, // do not auto-remove this notification
                          });
                          let modelNames;
                          switch (overwriteVariants) {
                            case VARIANT_OVERWRITE_OPTIONS.allModels:
                              modelNames = [...result.new, ...result.updated, ...result.unchanged];
                              if (!modelNames.length) {
                                return;
                              }

                              await importBulkGenomicVariants(modelNames)
                                .then(response => {
                                  if (response.data.success) {
                                    setImportProgress({
                                      ...importProgress,
                                      running: true,
                                    });
                                  }
                                })
                                .catch(async error => {
                                  await appendNotification({
                                    type: NOTIFICATION_TYPES.ERROR,
                                    message: 'Bulk Import of Research Somatic Variants Failed.',
                                    details: error.response
                                      ? error.response.data.error.message
                                      : error.message,
                                    timeout: false,
                                  });
                                });
                              break;
                            case VARIANT_OVERWRITE_OPTIONS.cleanOnly:
                              modelNames = [...result.new, ...result.updated, ...result.unchanged];
                              if (!modelNames.length) {
                                return;
                              }

                              const checkVariantsResponse = await auditGenomicVariantsSpecificModels(
                                modelNames,
                              );
                              await importBulkGenomicVariants(checkVariantsResponse.data.clean)
                                .then(response => {
                                  if (response.data.success) {
                                    setImportProgress({
                                      ...importProgress,
                                      running: true,
                                    });
                                  }
                                })
                                .catch(async error => {
                                  await appendNotification({
                                    type: NOTIFICATION_TYPES.ERROR,
                                    message: 'Bulk Import of Research Somatic Variants Failed.',
                                    details: error.response
                                      ? error.response.data.error.message
                                      : error.message,
                                    timeout: false,
                                  });
                                });
                              break;
                            case VARIANT_OVERWRITE_OPTIONS.none:
                            default:
                              break;
                          }
                        }),
                      )
                      .catch(async err => {
                        const errorText = extractErrorText(err);

                        await setState({
                          isLoading: false,
                        });

                        await appendNotification({
                          type: NOTIFICATION_TYPES.ERROR,
                          message: 'Model Upload Error.',
                          details: errorText.length > 0 ? errorText : 'Unknown error has occurred.',
                        });
                      });
                  },
                  bulkImportVariants: async modelNames => {
                    return importBulkGenomicVariants(modelNames)
                      .then(response => {
                        if (response.data.success) {
                          setImportProgress({
                            ...importProgress,
                            running: true,
                          });
                        }
                      })
                      .catch(async error => {
                        await appendNotification({
                          type: NOTIFICATION_TYPES.ERROR,
                          message: 'Bulk Import of Research Somatic Variants Failed.',
                          details: error.response
                            ? error.response.data.error.message
                            : error.message,
                          timeout: false,
                        });
                      });
                  },
                  bulkPublish: async () => {
                    // display a temporary notification immediately while waiting for the server response
                    const tempNotification = await appendNotification({
                      type: NOTIFICATION_TYPES.LOADING,
                      message: 'Initiating Bulk Publish...',
                      details:
                        'You can continue to use the CMS and will be notified when the publish is complete. Please note that some functions are unavailable during the publish process.',
                      timeout: false,
                    });
                    await publishBulk(state.selection)
                      .then(async response => {
                        if (response.data.success) {
                          await setPublishProgress({
                            ...publishProgress,
                            running: true,
                          });
                          await tempNotification.clear();
                        }
                      })
                      .catch(async error => {
                        await appendNotification({
                          type: NOTIFICATION_TYPES.ERROR,
                          message: 'Bulk Publish Failed.',
                          details: error.response
                            ? error.response.data.error.message
                            : error.message,
                          timeout: false,
                        });
                        await tempNotification.clear();
                      });
                  },
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
                    await publish(name)
                      .then(async () => {
                        await addPublishNotification(name);
                      })
                      .catch(async error => {
                        const data = error.response ? error.response.data : error;
                        showErrorPublishNotification(name, data);
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
                          type: NOTIFICATION_TYPES.SUCCESS,
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
                          type: NOTIFICATION_TYPES.ERROR,
                          message: `Unpublish Error.`,
                          details: errorText.length > 0 ? errorText : 'Unknown error has occurred.',
                          timeout: false, // do not auto-remove this notification when unpublishing
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
                          type: NOTIFICATION_TYPES.SUCCESS,
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
                          type: NOTIFICATION_TYPES.ERROR,
                          message: `Delete Error.`,
                          details: errorText.length > 0 ? errorText : 'Unknown error has occurred.',
                          timeout: false, // do not auto-remove this notification when deleting
                        });
                      });
                  },
                  refreshModelsTable: async () => {
                    const [dataResponse, countResponse] = await loadData(baseUrl, state);
                    setState(() => ({
                      isLoading: false,
                      data: dataResponse.data,
                      error: null,
                      rowCount: countResponse.data.count,
                      ...initPagingState,
                    }));
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
      </PublishNotificationsContext.Consumer>
    )}
  </NotificationsContext.Consumer>
);

export default ModelManagerController;
