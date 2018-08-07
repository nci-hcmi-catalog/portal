import React from 'react';
import Component from 'react-component-component';
import { fetchData } from '../services/Fetcher';

export const ModelSingleContext = React.createContext();

export const ModelSingleProvider = ({ baseUrl, modelName, children, ...props }) => (
  <Component
    initialState={{
      ui: {
        activeTab: 'edit',
      },
      data: {
        isLoading: false,
        response: [],
        error: null,
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
              response: err,
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
        }}
        {...props}
      >
        {children}
      </ModelSingleContext.Provider>
    )}
  </Component>
);

export default ModelSingleProvider;
