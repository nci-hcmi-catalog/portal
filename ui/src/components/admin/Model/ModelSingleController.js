import React from 'react';
import Component from 'react-component-component';
import { uniqBy, isEqual, get } from 'lodash';
import { NotificationsContext, NOTIFICATION_TYPES } from '../Notifications';
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
  isEmptyResult,
  getOtherModelsList,
  getMatchedModelSet,
  connectModelToSet,
  disconnectModelFromSets,
  singleAction,
} from '../helpers';
import { getDictionary } from '../helpers/dictionary';

import { modelStatus, computeModelStatus } from '@hcmi-portal/cms/src/helpers/modelStatus';
import { getPublishSchema } from '@hcmi-portal/cms/src/validation/model';
import { debounce } from 'lodash';

export const ModelSingleContext = React.createContext();

const getOtherModelOptions = async (baseUrl, modelName) => {
  return await getOtherModelsList(baseUrl, modelName, ['name', 'status', 'matchedModels']);
};

// Warning/FYI: This will modify the existing modelResponse.data object
const addMatchedModelsToModelResponse = async (baseUrl, modelResponse) => {
  try {
    if (modelResponse.data.matchedModels) {
      const matchedModelsResponse = await getMatchedModelSet(
        baseUrl,
        modelResponse.data.matchedModels,
      );
      // Just ensure we don't have an empty set, if we do we can ignore it
      if (matchedModelsResponse.data.models && matchedModelsResponse.data.models.length > 0) {
        const linkedModels = matchedModelsResponse.data.models.filter(
          (model) => model.name !== modelResponse.data.name,
        );

        // Check if the data needs a modelToConnect
        if (!modelResponse.data.modelToConnect) {
          modelResponse.data.modelToConnect = linkedModels[0].name;
        }

        // add the matchedModel set details
        modelResponse.data.linkedModels = linkedModels;
      }
    }
  } catch (err) {
    console.error(`Something went wrong updating the multiple model sets: ${err}`);
  }
};

const applyMatchedModelChanges = async (baseUrl, values, modelDataResponse) => {
  // Now that the model is saved, we can connect or disconnect it from a matched set
  // once complete, we update the data in modelDataResponse so it shows on the form on reload.
  if (values.modelToConnect) {
    // Matched Model Set Connection required

    const connectResponse = await connectModelToSet(baseUrl, values.name, values.modelToConnect);
    modelDataResponse.data.matchedModels = connectResponse.data.matchedModels._id;
  } else if (!values.modelToConnect && values.matchedModels) {
    // Matched Model Set Disconnection required
    await disconnectModelFromSets(baseUrl, values.name);
    delete modelDataResponse.data.matchedModels;
  }
};

// Provider
export const ModelSingleProvider = ({ baseUrl, modelName, children, ...props }) => (
  <NotificationsContext.Consumer>
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
            filterValue: '',
            minRows: 0,
            rowCount: 0,
            page: 0,
            pageSize: 10,
            isLoading: false,
            initialized: false,
          },
          genomicVariantTable: {
            selection: [],
            selectAll: false,
            filterValue: '',
            minRows: 0,
            rowCount: 0,
            page: 0,
            pageSize: 10,
            isLoading: false,
            initialized: false,
          },
          otherModelOptions: [],
          matchedModels: [],
          dictionary: null,
          validator: null,
        }}
        didMount={async ({ setState }) => {
          if (modelName) {
            // Set loading true
            setState((state) => ({
              data: {
                ...state.data,
                isLoading: true,
              },
            }));

            try {
              const modelDataResponse = await getModel(baseUrl, modelName);
              await addMatchedModelsToModelResponse(baseUrl, modelDataResponse);

              setState((state) => ({
                data: {
                  ...state.data,
                  isLoading: false,
                  didLoad: true,
                  response: { ...modelDataResponse.data },
                },
                variantTable: {
                  ...state.variantTable,
                  rowCount: (modelDataResponse.data.variants || []).length,
                },
                genomicVariantTable: {
                  ...state.genomicVariantTable,
                  rowCount: (modelDataResponse.data.genomic_variants || []).length,
                },
                matchedModels: modelDataResponse.data.linkedModels || [],
              }));
            } catch (err) {
              setState((state) => ({
                data: {
                  ...state.data,
                  isLoading: false,
                  error: err,
                },
              }));
            }
          }

          try {
            const otherModelOptions = await getOtherModelOptions(baseUrl, modelName);
            const dictionary = await getDictionary();
            const excludeNames = otherModelOptions.map((option) => option.name);
            const validator = await getPublishSchema(excludeNames, dictionary);
            setState((state) => ({
              otherModelOptions,
              dictionary,
              validator,
            }));
          } catch (e) {
            console.error('Unable to load dictionary values for form:', e);
          }
        }}
        didUpdate={debounce(
          async ({ state, setState, prevState }) => {
            if (
              state.genomicVariantTable.pageSize !== prevState.genomicVariantTable.pageSize ||
              state.genomicVariantTable.page !== prevState.genomicVariantTable.page ||
              state.genomicVariantTable.filterValue !== prevState.genomicVariantTable.filterValue ||
              state.genomicVariantTable.sorted !== prevState.genomicVariantTable.sorted
            ) {
              try {
                setState((state) => ({
                  ...state,
                  genomicVariantTable: {
                    ...state.genomicVariantTable,
                    isLoading: false,
                  },
                }));
              } catch (err) {
                setState((state) => ({
                  ...state,
                  genomicVariantTable: {
                    ...state.genomicVariantTable,
                    isLoading: false,
                  },
                  data: {
                    isLoading: false,
                    data: [],
                    error: err,
                  },
                }));
              }
            }
          },
          300,
          { maxWait: 1000, trailing: true },
        )}
      >
        {({ state, setState }) => (
          <ModelSingleContext.Provider
            value={{
              state: state,
              setUIActiveTab: (tabName) => {
                setState((state) => ({
                  ui: {
                    ...state.ModelSingle,
                    activeTab: tabName,
                  },
                  form: {
                    ...state.form,
                    isReadyToSave: state.form.isReadyToSave,
                  },
                }));
              },
              syncFormState: async (formState) => {
                setState((state) => ({
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
                }));
              },
              setMatchedModels: async (matches) => {
                await setState((state) => ({
                  matchedModels: matches,
                }));
              },
              saveForm: async ({
                values,
                images = [],
                successNotification = {
                  type: 'success',
                  message: 'Save Successful!',
                  details: 'Model has been successfully saved, however not yet published.',
                },
              }) => {
                // Set loading true (lock UI)
                await setState((state) => ({
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
                    data.files = uniqBy(images, (image) => image.file_id);
                  }

                  // When saving, the only time we pass status is when we need to
                  // update to 'unpublished' status - otherwise we don't pass status
                  // key in response as that would trigger an ES update
                  if (data.status && data.status !== modelStatus.unpublishedChanges) {
                    delete data.status;
                  }

                  const modelDataResponse = await saveModel(baseUrl, data, isUpdate);

                  // Connect or disconnect the model to a matched set, as required.
                  await applyMatchedModelChanges(baseUrl, values, modelDataResponse);

                  // And now we run the initialize matched models code before setting state:
                  await addMatchedModelsToModelResponse(baseUrl, modelDataResponse);

                  const otherModelOptions = await getOtherModelOptions(
                    baseUrl,
                    modelDataResponse.data.name,
                  );
                  await setState((state) => ({
                    // Set form to unsavable status (will release on next form interaction)
                    form: {
                      ...state.form,
                      values: modelDataResponse.data,
                      isReadyToSave: false,
                      // if files is different in new state
                      isReadyToPublish:
                        (!isEqual(
                          (modelDataResponse.data || {}).files || [],
                          (state.data.response || {}).files || [],
                        ) &&
                          Object.keys(state.form.errors).length === 0) ||
                        state.form.isReadyToPublish,
                    },
                    // Put save response into data
                    data: {
                      ...state.data,
                      isLoading: false,
                      didLoad: true,
                      response: modelDataResponse.data,
                    },
                    otherModelOptions,
                  }));
                  successNotification && (await appendNotification(successNotification));
                } catch (err) {
                  await setState((state) => ({
                    data: {
                      ...state.data,
                      isLoading: false,
                      error: err,
                    },
                  }));

                  await appendNotification({
                    type: NOTIFICATION_TYPES.ERROR,
                    message: 'Save Error.',
                    details:
                      err.msg || get(err, 'response.data.message', 'Unknown error has occurred.'),
                  });
                }
              },
              publishForm: async (values) => {
                // Set loading true (lock UI)
                await setState((state) => ({
                  data: {
                    ...state.data,
                    isLoading: true,
                  },
                }));

                const { name } = values;

                singleAction('publish', name)
                  .then(async () => {
                    // Fetch full model data in order to update model status
                    const modelDataResponse = await getModel(baseUrl, name);
                    // Prepare matched model details if necessary
                    await addMatchedModelsToModelResponse(baseUrl, modelDataResponse);
                    const otherModelOptions = await getOtherModelOptions(
                      baseUrl,
                      modelDataResponse.data.name,
                    );

                    await setState((state) => ({
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
                      otherModelOptions,
                    }));

                    await appendNotification({
                      type: NOTIFICATION_TYPES.SUCCESS,
                      message: 'Publish Successful!',
                      details: `${name} has been successfully published. View it live here: `,
                      link: `/model/${name}`,
                      linkText: name,
                    });
                  })
                  .catch(async (err) => {
                    const errorText = extractErrorText(err);

                    await setState((state) => ({
                      data: {
                        ...state.data,
                        isLoading: false,
                        error: err,
                      },
                    }));

                    await appendNotification({
                      type: NOTIFICATION_TYPES.ERROR,
                      message: 'Publish Error.',
                      details:
                        errorText ||
                        err.msg ||
                        get(err, 'response.data.message', 'Unknown error has occurred.'),
                    });
                  });
              },
              unpublishModel: async (values) => {
                const { name } = values;

                // Set loading true (lock UI)
                await setState((state) => ({
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
                  await addMatchedModelsToModelResponse(baseUrl, modelDataResponse);
                  const otherModelOptions = await getOtherModelOptions(
                    baseUrl,
                    modelDataResponse.data.name,
                  );

                  await setState((state) => ({
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
                    otherModelOptions,
                  }));

                  await appendNotification({
                    type: NOTIFICATION_TYPES.SUCCESS,
                    message: 'Unpublish Successful!',
                    details: `${name} has been successfully unpublished and will no longer appear on the public portal.`,
                  });
                } catch (err) {
                  await setState((state) => ({
                    data: {
                      ...state.data,
                      isLoading: false,
                      error: err,
                    },
                  }));

                  await appendNotification({
                    type: NOTIFICATION_TYPES.ERROR,
                    message: 'Unpublish Error.',
                    details:
                      err.msg || get(err, 'response.data.message', 'Unknown error has occurred.'),
                  });
                }
              },
              deleteModel: async (name, next = () => null) => {
                // Set loading true (lock UI)
                await setState((state) => ({
                  data: {
                    ...state.data,
                    isLoading: true,
                  },
                }));

                try {
                  await deleteModel(baseUrl, name);
                  next();
                } catch (err) {
                  setState((state) => ({
                    data: {
                      ...state.data,
                      isLoading: false,
                      error: err,
                    },
                  }));

                  await appendNotification({
                    type: NOTIFICATION_TYPES.ERROR,
                    message: 'Delete Error.',
                    details:
                      err.msg || get(err, 'response.data.message', 'Unknown error has occurred.'),
                  });
                }
              },
              attachVariants: async (sheetURL, overwrite, modelName) => {
                // Set loading true (lock UI)
                await setState((state) => ({
                  data: {
                    ...state.data,
                    isLoading: true,
                  },
                }));

                attachVariants(baseUrl, sheetURL, overwrite, modelName)
                  .then(({ data: { result } }) =>
                    // Reload model data with new variants
                    getModel(baseUrl, modelName).then(async (modelDataResponse) => {
                      await setState((state) => ({
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
                        variantTable: {
                          ...state.variantTable,
                          rowCount: (modelDataResponse.data.variants || []).length,
                        },
                        genomicVariantTable: {
                          ...state.genomicVariantTable,
                          rowCount: (modelDataResponse.data.genomic_variants || []).length,
                        },
                      }));
                      const anyUpdatesDone = isEmptyResult(result);
                      const notificationMessage = anyUpdatesDone
                        ? `No suitable data is available to upload. No changes were made.`
                        : `Bulk Upload of clinical variants has successfully completed. New clinical variants or updated fields are saved but not yet published.`;

                      await appendNotification({
                        type:
                          result.errors.length > 0
                            ? NOTIFICATION_TYPES.WARNING
                            : NOTIFICATION_TYPES.SUCCESS,
                        message: notificationMessage,
                        details: anyUpdatesDone ? '' : extractResultText(result, 'variant'),
                        bulkErrors: result.errors,
                        timeout: false, // do not auto-remove this notification
                      });
                    }),
                  )
                  .catch(async (err) => {
                    const errorText = extractErrorText(err);

                    await setState((state) => ({
                      data: {
                        ...state.data,
                        isLoading: false,
                      },
                    }));

                    await appendNotification({
                      type: NOTIFICATION_TYPES.ERROR,
                      message: 'Variants Upload Error.',
                      details: errorText.length > 0 ? errorText : 'Unknown error has occurred.',
                    });
                  });
              },
              deleteVariant: async (id) => {
                // Set loading true (lock UI)
                await setState((state) => ({
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
                    variants_modified: true,
                    status: computeModelStatus(modelData.status, 'save'),
                  };

                  const modelDataResponse = await saveModel(baseUrl, modelUpdate, true);

                  await setState((state) => ({
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
                    variantTable: {
                      ...state.variantTable,
                      rowCount: (modelDataResponse.data.variants || []).length,
                    },
                  }));

                  await appendNotification({
                    type: NOTIFICATION_TYPES.SUCCESS,
                    message: 'Variant Deleted Successful!',
                    details: 'Model variant relation has been successfully deleted.',
                  });
                } catch (err) {
                  await setState((state) => ({
                    data: {
                      ...state.data,
                      isLoading: false,
                      error: err,
                    },
                  }));

                  await appendNotification({
                    type: NOTIFICATION_TYPES.ERROR,
                    message: 'Variant Delete Error.',
                    details:
                      err.msg || get(err, 'response.data.message', 'Unknown error has occurred.'),
                  });
                }
              },
              uploadImages: async (files) => {
                const uploaded = await files.reduce(async (accPromise, file) => {
                  let acc = await accPromise;
                  let formData = new FormData();
                  formData.append('filename', file.name);
                  formData.append('image', file);
                  const loadingNotification = await appendNotification({
                    type: NOTIFICATION_TYPES.LOADING,
                    message: 'Uploading Image(s)',
                    details: 'You will be notified when the upload is complete.',
                    timeout: false,
                  });

                  acc = await fetchData({
                    url: `${baseUrl}/images`,
                    data: formData,
                    method: 'post',
                    headers: {
                      'Content-Type': 'multipart/form-data',
                    },
                  })
                    .then((response) => {
                      if (response.status >= 200 && response.status < 300) {
                        window.URL.revokeObjectURL(file.preview);
                        return [
                          ...acc,
                          {
                            file_name: file.name,
                            file_type: file.type,
                            file_id: response.data.id,
                            file_url: response.data.url,
                          },
                        ];
                      }
                    })
                    .catch(async (err) => {
                      await appendNotification({
                        type: NOTIFICATION_TYPES.ERROR,
                        message: 'Image Upload Error',
                        details: `Image upload failed due to the following error: ${err.message}`,
                        timeout: false,
                      });
                      return acc;
                    });

                  loadingNotification.clear();
                  return acc;
                }, Promise.resolve([]));
                return uploaded;
              },
              variantTableControls: generateTableActions(
                setState,
                state.data.response.variants || [],
                'variantTable',
              ),
              genomicVariantTableControls: generateTableActions(
                setState,
                state.data.response.genomic_variants || [],
                'genomicVariantTable',
              ),
              fetchGenomicVariantData: async (modelName) => {
                if (modelName) {
                  // Set loading true
                  setState((state) => ({
                    data: {
                      ...state.data,
                      isLoading: true,
                    },
                  }));

                  try {
                    const modelDataResponse = await getModel(baseUrl, modelName);

                    setState((state) => ({
                      form: {
                        ...state.form,
                        values: modelDataResponse.data,
                        // recompute isFormReadyToPublish
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
                        response: {
                          ...state.data.response,
                          status: modelDataResponse.data.status,
                          gene_metadata: modelDataResponse.data.gene_metadata,
                          genomic_variants: modelDataResponse.data.genomic_variants,
                        },
                      },
                      genomicVariantTable: {
                        ...state.genomicVariantTable,
                        rowCount: (modelDataResponse.data.genomic_variants || []).length,
                      },
                    }));
                  } catch (err) {
                    setState((state) => ({
                      data: {
                        ...state.data,
                        isLoading: false,
                        error: err,
                      },
                    }));
                  }
                }
              },
              fetchModelData: async (modelName) => {
                if (modelName) {
                  setState((state) => ({
                    data: {
                      ...state.data,
                      isLoading: true,
                    },
                  }));

                  try {
                    // Fetch full model data in order to update model status
                    const modelDataResponse = await getModel(baseUrl, modelName);
                    // Prepare matched model details if necessary
                    await addMatchedModelsToModelResponse(baseUrl, modelDataResponse);
                    const otherModelOptions = await getOtherModelOptions(
                      baseUrl,
                      modelDataResponse.data.name,
                    );

                    await setState((state) => ({
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
                      otherModelOptions,
                    }));
                  } catch (err) {
                    setState((state) => ({
                      data: {
                        ...state.data,
                        isLoading: false,
                        error: err,
                      },
                    }));
                  }
                }
              },
            }}
            {...props}
          >
            {children}
          </ModelSingleContext.Provider>
        )}
      </Component>
    )}
  </NotificationsContext.Consumer>
);

export default ModelSingleProvider;
