import React from 'react';
import Component from 'react-component-component';
import axios from 'axios';

const fetchData = async ({ url, data, method }) => {
  return await axios({ url, data, method });
};

export const get = async ({ url, params }) => {
  return await fetchData({ url, params, method: 'get' });
};

export const post = async ({ url, data }) => {
  return await fetchData({ url, data, method: 'post' });
};

export const Fetcher = ({ url, data, method, children }) => (
  <Component
    initialState={{
      isLoading: true,
      data: null,
      error: null,
    }}
    didMount={async ({ setState }) => {
      try {
        const response = await fetchData({ url, data, method });
        setState(() => ({ isLoading: false, data: response.data, error: null }));
      } catch (err) {
        setState(() => ({ isLoading: false, data: null, error: err }));
      }
    }}
  >
    {({ state }) => children(state)}
  </Component>
);
