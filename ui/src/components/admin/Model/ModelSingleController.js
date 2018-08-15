import React from 'react';
import Component from 'react-component-component';
import { fetchData } from '../services/Fetcher';

export const ModelSingleContext = React.createContext();

// Helper functions
const isFormReadyToSave = (dirty, errors) => dirty && !('model_name' in errors);

const isFormReadyToPublish = (values, errors) =>
  '_id' in values && Object.keys(errors).length === 0;

// Provider
export const ModelSingleProvider = ({ baseUrl, modelName, children, ...props }) => (
  <Component
    initialState={{
      ui: {
        activeTab: 'edit',
      },
      data: {
        isLoading: false,
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
          const modelDataResponse = await fetchData({
            url: `${baseUrl}/model/${modelName}`,
            data: '',
            method: 'get',
          });

          setState(() => ({
            ...state,
            data: {
              ...state.data,
              isLoading: false,
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
                isReadyToSave: formState.errors
                  ? isFormReadyToSave(formState.dirty, formState.errors)
                  : isFormReadyToSave(state.form.dirty, state.form.errors),
                isReadyToPublish: formState.errors
                  ? await isFormReadyToPublish(formState.values, formState.errors)
                  : await isFormReadyToPublish(state.form.values, state.form.errors),
              },
            });
          },
          saveForm: async values => {
            const {
              form: { isUpdate },
            } = state;

            const { model_name } = values;

            const url = isUpdate ? `${baseUrl}/model/${model_name}` : `${baseUrl}/model`;

            const modelDataResponse = await fetchData({
              url,
              data: values,
              method: isUpdate ? 'patch' : 'post',
            });

            // TODO: Do something with response?
            console.log(modelDataResponse);

            // Set form to unsavable status (will release on next form interaction)
            setState({
              ...state,
              form: {
                ...state.form,
                isReadyToSave: false,
              },
            });
          },
          publishForm: async id => {
            // TODO: Only publish if new update?
            const url = `${baseUrl}/publish/model/${id}`;

            const modelDataResponse = await fetchData({
              url,
              data: '',
              method: 'post',
            });

            // TODO: Do something with response?
            console.log(modelDataResponse);

            // TODO: Set form to pubished status (will release on next save?)
            setState({
              ...state,
              form: {
                ...state.form,
                isReadyToPublish: false,
              },
            });
          },
        }}
        {...props}
      >
        {children}
      </ModelSingleContext.Provider>
    )}
  </Component>
);

export default ModelSingleProvider;
