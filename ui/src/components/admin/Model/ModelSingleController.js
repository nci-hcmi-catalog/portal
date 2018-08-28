import React from 'react';
import Component from 'react-component-component';
import { fetchData } from '../services/Fetcher';

export const ModelSingleContext = React.createContext();

// Constants
const status = {
  unpublished: 'unpublished',
  unpublishedChanges: 'unpublished changes',
  other: 'other',
  published: 'published',
};

// Helper functions
const isFormReadyToSave = (dirty, errors) => dirty && !('name' in errors);

const isFormReadyToPublish = (values, dirty, errors) =>
  (values.status !== 'published' || dirty) && Object.keys(errors).length === 0;

const computeModelStatus = (currentStatus, action) => {
  /*
  *  Matrix
  * -------------------------------------------
  *             |    save     |    publish    |
  * -------------------------------------------
  * unpublished | unpublished |   published   |
  * unpub. chgs | unpub. chgs |   published   |
  * other       | unpublished |   published   |
  * published   | unpub. chgs |   published   |
  * -------------------------------------------
*/

  const statusMatrix = {
    unpublished: {
      save: status.unpublished,
      publish: status.published,
    },
    unpublishedChanges: {
      save: status.unpublishedChanges,
      publish: status.published,
    },
    other: {
      save: status.unpublished,
      publish: status.published,
    },
    published: {
      save: status.unpublishedChanges,
      publish: status.published,
    },
  };

  const statusKey = Object.keys(status).find(key => status[key] === currentStatus);

  return currentStatus ? statusMatrix[statusKey][action] : status.unpublished;
};

// Add an id to notifications (ISO Datetime)
const generateNotification = notification => ({
  ...notification,
  id: new Date().valueOf(),
});

// async abstractions
const getModel = async (baseUrl, modelName) =>
  fetchData({
    url: `${baseUrl}/model/${modelName}`,
    data: '',
    method: 'get',
  });

const saveModel = async (baseUrl, values, isUpdate) => {
  const { name } = values;

  const url = isUpdate ? `${baseUrl}/model/${name}` : `${baseUrl}/model`;

  return fetchData({
    url,
    data: values,
    method: isUpdate ? 'patch' : 'post',
  });
};

const deleteModel = async (baseUrl, modelName) =>
  fetchData({
    url: `${baseUrl}/model/${modelName}`,
    data: '',
    method: 'delete',
  });

// Provider
export const ModelSingleProvider = ({ baseUrl, modelName, children, ...props }) => (
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
      notifications: [],
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
          saveForm: async values => {
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

              const data = {
                ...values,
                status: computeModelStatus(values.status, 'save'),
              };

              // When saving, the only time we pass status is when we need to
              // update to 'unpublished' status - otherwise we don't pass status
              // key in response as that would trigger an ES update
              if (data.status && data.status !== status.unpublishedChanges) {
                delete data.status;
              }

              const modelDataResponse = await saveModel(baseUrl, data, isUpdate);

              await setState(() => ({
                ...state,
                // Set form to unsavable status (will release on next form interaction)
                form: {
                  ...state.form,
                  isReadyToSave: false,
                },
                // Put save response into data
                data: {
                  ...state.data,
                  isLoading: false,
                  didLoad: true,
                  response: modelDataResponse.data,
                },
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'success',
                    message: 'Save Successful!',
                    details: 'Model has been succesfully saved, however not yet published.',
                  }),
                ],
              }));
            } catch (err) {
              setState(() => ({
                ...state,
                data: {
                  ...state.data,
                  isLoading: false,
                  error: err,
                },
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'error',
                    message: 'Save Error.',
                    details: err.msg || 'Unknown error has occured.',
                  }),
                ],
              }));
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
              } = state;

              const { name } = values;

              // Publishing will always trigger an update
              // so we pass status in with our save
              const modelDataResponse = await saveModel(
                baseUrl,
                {
                  ...values,
                  status: computeModelStatus(values.status, 'publish'),
                },
                isUpdate,
              );

              setState({
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
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'success',
                    message: 'Publish Successful!',
                    details: `${name} has been succesfully published. View it live here: `,
                    link: `/model/${modelDataResponse.data.name}`,
                    linkText: modelDataResponse.data.name,
                  }),
                ],
              });
            } catch (err) {
              setState(() => ({
                ...state,
                data: {
                  ...state.data,
                  isLoading: false,
                  error: err,
                },
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'error',
                    message: 'Publish Error.',
                    details: err.msg || 'Unknown error has occured.',
                  }),
                ],
              }));
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
                { ...values, status: status.unpublished },
                true,
              );

              setState({
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
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'success',
                    message: 'Unpublish Successful!',
                    details: `${name} has been succesfully unpublished and will no longer appear on the public portal`,
                  }),
                ],
              });
            } catch (err) {
              setState(() => ({
                ...state,
                data: {
                  ...state.data,
                  isLoading: false,
                  error: err,
                },
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'error',
                    message: 'Unpublish Error.',
                    details: err.msg || 'Unknown error has occured.',
                  }),
                ],
              }));
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
                notifications: [
                  ...state.notifications,
                  generateNotification({
                    type: 'error',
                    message: 'Delete Error.',
                    details: err.msg || 'Unknown error has occured.',
                  }),
                ],
              }));
            }
          },
          clearNotification: id => {
            const notifications = state.notifications.filter(
              notification => notification.id !== id,
            );
            setState({
              ...state,
              notifications,
            });
          },
          clearAllNotifications: () =>
            setState({
              ...state,
              notifications: [],
            }),
        }}
        {...props}
      >
        {children}
      </ModelSingleContext.Provider>
    )}
  </Component>
);

export default ModelSingleProvider;
