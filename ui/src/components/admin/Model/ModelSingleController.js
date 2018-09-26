import React from 'react';
import Component from 'react-component-component';
import { uniqBy, isEqual } from 'lodash';
import { NotificationsContext } from '../Notifications';
import { fetchData } from '../services/Fetcher';
import {
  isFormReadyToSave,
  isFormReadyToPublish,
  getModel,
  saveModel,
  deleteModel,
  attachVariants,
  extractResultText,
  extractErrorText,
  generateTableActions,
} from '../helpers';

import { modelStatus, computeModelStatus } from '@hcmi-portal/cms/src/helpers/modelStatus';

export const ModelSingleContext = React.createContext();

// Provider
export const ModelSingleProvider = ({ baseUrl, modelName, children, ...props }) => (
  <NotificationsContext>
    {({ appendNotification }) => (
      <Component
        initialState={{
          ui: {
            activeTab: 'edit',
          },
          data: {
            isLoading: false,
            didLoad: false,
            response: {},
            error: null,
          },
          form: {
            isReadyToSave: false,
            isReadyToPublish: false,
            isUpdate: false,
            values: {},
            dirty: false,
            touched: {},
            errors: {},
          },
          variantTable: {
            selection: [],
            selectAll: false,
            minRows: 0,
            rowCount: 0,
            page: 0,
            pageSize: 10,
            isLoading: false,
          },
        }}
        didMount={async ({ state, setState }) => {
          if (modelName) {
            // Set loading true
            setState(() => ({
              ...state,
              data: {
                ...state.data,
                isLoading: true,
              },
            }));

            try {
              const modelDataResponse = await getModel(baseUrl, modelName);
              setState(() => ({
                ...state,
                data: {
                  ...state.data,
                  isLoading: false,
                  didLoad: true,
                  response: modelDataResponse.data,
                },
              }));
            } catch (err) {
              setState(() => ({
                ...state,
                data: {
                  ...state.data,
                  isLoading: false,
                  error: err,
                },
              }));
            }
          }
        }}
      >
        {({ state, setState }) => (
          <ModelSingleContext.Provider
            value={{
              state: state,
              setUIActiveTab: tabName => {
                setState({
                  ...state,
                  ui: {
                    ...state.ModelSingle,
                    activeTab: tabName,
                  },
                  form: {
                    ...state.form,
                    isReadyToSave: state.form.isReadyToSave,
                  },
                });
              },
              syncFormState: async formState => {
                setState({
                  ...state,
                  form: {
                    ...state.form,
                    ...formState,
                    isReadyToSave: isFormReadyToSave(formState.dirty, formState.errors),
                    isReadyToPublish: isFormReadyToPublish(
                      formState.values,
                      formState.dirty,
                      formState.errors,
                    ),
                  },
                });
              },
              saveForm: async ({
                values,
                images = [],
                successNotification = {
                  type: 'success',
                  message: 'Save Successful!',
                  details: 'Model has been succesfully saved, however not yet published.',
                },
              }) => {
                // Set loading true (lock UI)
                await setState(() => ({
                  ...state,
                  data: {
                    ...state.data,
                    isLoading: true,
                  },
                }));

                try {
                  const {
                    form: { isUpdate },
                  } = state;

                  let data = {
                    ...values,
                    status: computeModelStatus(values.status, 'save'),
                  };

                  // If we're doing something with images send the files key
                  if (images.length > 0) {
                    data.files = uniqBy(images, image => image.file_id);
                  }

                  // When saving, the only time we pass status is when we need to
                  // update to 'unpublished' status - otherwise we don't pass status
                  // key in response as that would trigger an ES update
                  if (data.status && data.status !== modelStatus.unpublishedChanges) {
                    delete data.status;
                  }

                  const modelDataResponse = await saveModel(baseUrl, data, isUpdate);

                  await setState(() => ({
                    ...state,
                    // Set form to unsavable status (will release on next form interaction)
                    form: {
                      ...state.form,
                      values: modelDataResponse.data,
                      isReadyToSave: false,
                      // if files is different in new state
                      isReadyToPublish:
                        !isEqual(
                          (modelDataResponse.data.response || {}).files || [],
                          (state.data.response || {}).files || [],
                        ) || state.form.isReadyToPublish,
                    },
                    // Put save response into data
                    data: {
                      ...state.data,
                      isLoading: false,
                      didLoad: true,
                      response: modelDataResponse.data,
                    },
                  }));
                  successNotification && (await appendNotification(successNotification));
                } catch (err) {
                  await setState(() => ({
                    ...state,
                    data: {
                      ...state.data,
                      isLoading: false,
                      error: err,
                    },
                  }));

                  await appendNotification({
                    type: 'error',
                    message: 'Save Error.',
                    details: err.msg || 'Unknown error has occured.',
                  });
                }
              },
              publishForm: async values => {
                // Set loading true (lock UI)
                await setState(() => ({
                  ...state,
                  data: {
                    ...state.data,
                    isLoading: true,
                  },
                }));

                try {
                  const {
                    form: { isUpdate },
                    data: {
                      response: { files = [] },
                    },
                  } = state;

                  const { name } = values;

                  // Publishing will always trigger an update
                  // so we pass status in with our save
                  const modelDataResponse = await saveModel(
                    baseUrl,
                    {
                      ...values,
                      files,
                      status: computeModelStatus(values.status, 'publish'),
                    },
                    isUpdate,
                  );

                  await setState({
                    ...state,
                    form: {
                      ...state.form,
                      isReadyToPublish: false,
                      isReadyToSave: false,
                    },
                    data: {
                      ...state.data,
                      isLoading: false,
                      response: modelDataResponse.data,
                    },
                  });

                  await appendNotification({
                    type: 'success',
                    message: 'Publish Successful!',
                    details: `${name} has been succesfully published. View it live here: `,
                    link: `/model/${modelDataResponse.data.name}`,
                    linkText: modelDataResponse.data.name,
                  });
                } catch (err) {
                  await setState(() => ({
                    ...state,
                    data: {
                      ...state.data,
                      isLoading: false,
                      error: err,
                    },
                  }));

                  await appendNotification({
                    type: 'error',
                    message: 'Publish Error.',
                    details: err.msg || 'Unknown error has occured.',
                  });
                }
              },
              unpublishModel: async values => {
                const { name } = values;

                // Set loading true (lock UI)
                await setState(() => ({
                  ...state,
                  data: {
                    ...state.data,
                    isLoading: true,
                  },
                }));

                try {
                  // Unpublishing will always trigger an update
                  // so we pass status in with our save
                  const modelDataResponse = await saveModel(
                    baseUrl,
                    { ...values, status: modelStatus.unpublished },
                    true,
                  );

                  await setState({
                    ...state,
                    form: {
                      ...state.form,
                      isReadyToPublish: false,
                      isReadyToSave: false,
                    },
                    data: {
                      ...state.data,
                      isLoading: false,
                      response: modelDataResponse.data,
                    },
                  });

                  await appendNotification({
                    type: 'success',
                    message: 'Unpublish Successful!',
                    details: `${name} has been succesfully unpublished and will no longer appear on the public portal.`,
                  });
                } catch (err) {
                  await setState(() => ({
                    ...state,
                    data: {
                      ...state.data,
                      isLoading: false,
                      error: err,
                    },
                  }));

                  await appendNotification({
                    type: 'error',
                    message: 'Unpublish Error.',
                    details: err.msg || 'Unknown error has occured.',
                  });
                }
              },
              deleteModel: async (name, next = () => null) => {
                // Set loading true (lock UI)
                await setState(() => ({
                  ...state,
                  data: {
                    ...state.data,
                    isLoading: true,
                  },
                }));

                try {
                  await deleteModel(baseUrl, name);
                  next();
                } catch (err) {
                  setState(() => ({
                    ...state,
                    data: {
                      ...state.data,
                      isLoading: false,
                      error: err,
                    },
                  }));

                  await appendNotification({
                    type: 'error',
                    message: 'Delete Error.',
                    details: err.msg || 'Unknown error has occured.',
                  });
                }
              },
              attachVariants: async (sheetURL, overwrite, modelName) => {
                // Set loading true (lock UI)
                await setState(() => ({
                  ...state,
                  data: {
                    ...state.data,
                    isLoading: true,
                  },
                }));

                attachVariants(baseUrl, sheetURL, overwrite)
                  .then(({ data: { result } }) =>
                    // Reload model data with new variants
                    getModel(baseUrl, modelName).then(async modelDataResponse => {
                      await setState({
                        ...state,
                        form: {
                          ...state.form,
                          values: modelDataResponse.data,
                          // recompute isFormReadyToPublish on attach
                          isReadyToPublish: isFormReadyToPublish(
                            modelDataResponse.data,
                            state.form.dirty,
                            state.form.errors,
                          ),
                        },
                        data: {
                          ...state.data,
                          isLoading: false,
                          didLoad: true,
                          response: modelDataResponse.data,
                        },
                      });

                      await appendNotification({
                        type: result.errors.length > 0 ? 'warning' : 'success',
                        message: 'Variants Upload Complete',
                        details: extractResultText(result, 'variant'),
                        bulkErrors: result.errors,
                        timeout: false, // do not auto-remove this notification
                      });
                    }),
                  )
                  .catch(async err => {
                    const errorText = extractErrorText(err);

                    await setState(() => ({
                      ...state,
                      data: {
                        ...state.data,
                        isLoading: false,
                      },
                    }));

                    await appendNotification({
                      type: 'error',
                      message: 'Variants Upload Error.',
                      details: errorText.length > 0 ? errorText : 'Unknown error has occured.',
                    });
                  });
              },
              deleteVariant: async id => {
                // Set loading true (lock UI)
                await setState(() => ({
                  ...state,
                  data: {
                    ...state.data,
                    isLoading: true,
                  },
                }));

                try {
                  const modelData = state.data.response;

                  let modelUpdate = {
                    ...modelData,
                    variants: modelData.variants.filter(({ _id }) => id !== _id),
                  };

                  if (modelUpdate.status && modelUpdate.status !== modelStatus.unpublishedChanges) {
                    delete modelUpdate.status;
                  }

                  const modelDataResponse = await saveModel(baseUrl, modelUpdate, true);

                  await setState(() => ({
                    ...state,
                    // Set form to unsavable status (will release on next form interaction)
                    form: {
                      ...state.form,
                      values: modelDataResponse.data,
                      isReadyToSave: false,
                      // if files is different in new state
                      isReadyToPublish:
                        !isEqual(
                          (modelDataResponse.data.response || {}).files || [],
                          (state.data.response || {}).files || [],
                        ) || state.form.isReadyToPublish,
                    },
                    // Put save response into data
                    data: {
                      ...state.data,
                      isLoading: false,
                      didLoad: true,
                      response: modelDataResponse.data,
                    },
                  }));

                  await appendNotification({
                    type: 'success',
                    message: 'Variant Deleted Successful!',
                    details: 'Model variant relation has been successfully deleted.',
                  });
                } catch (err) {
                  await setState(() => ({
                    ...state,
                    data: {
                      ...state.data,
                      isLoading: false,
                      error: err,
                    },
                  }));

                  await appendNotification({
                    type: 'error',
                    message: 'Variant Delete Error.',
                    details: err.msg || 'Unknown error has occured.',
                  });
                }
              },
              uploadImages: async files => {
                const uploaded = await files.reduce(async (accPromise, file) => {
                  let acc = await accPromise;
                  let formData = new FormData();
                  formData.append('filename', file.name);
                  formData.append('image', file);
                  const response = await fetchData({
                    url: `${baseUrl}/images`,
                    data: formData,
                    method: 'post',
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  });
                  if (response.status >= 200 && response.status < 300) {
                    window.URL.revokeObjectURL(file.preview);
                    return [
                      ...acc,
                      { file_name: file.name, file_type: file.type, file_id: response.data.id },
                    ];
                  }
                  return acc;
                }, Promise.resolve([]));
                return uploaded;
              },
              variantTableControlls: generateTableActions(
                state.variantTable,
                newvariantTableState =>
                  setState({
                    ...state,
                    variantTable: { ...state.variantTable, ...newvariantTableState },
                  }),
                state.data.response.variants || [],
              ),
            }}
            {...props}
          >
            {children}
          </ModelSingleContext.Provider>
        )}
      </Component>
    )}
  </NotificationsContext>
);

export default ModelSingleProvider;
