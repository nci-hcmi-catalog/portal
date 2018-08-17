import React from 'react';
import PropTypes from 'prop-types';
import Component from 'react-component-component';
import axios from 'axios';

export const fetchData = async ({ url, data, method, headers }) => {
  return await axios({ url, data, method, headers });
};

export const get = async ({ url, params, headers }) => {
  return await fetchData({ url, params, method: 'get', headers });
};

export const post = async ({ url, data, headers }) => {
  return await fetchData({ url, data, method: 'post', headers });
};

export const Fetcher = ({ url, data, method, children }) => (
  <Component
    initialState={{
      isLoading: true,
      data: [],
      error: null,
    }}
    didMount={async ({ setState }) => {
      try {
        const response = await fetchData({ url, data, method });
        setState(() => ({ isLoading: false, data: response.data, error: null }));
      } catch (err) {
        setState(() => ({ isLoading: false, data: [], error: err }));
      }
    }}
  >
    {({ state }) =>
      children({
        ...state,
      })
    }
  </Component>
);

Fetcher.propTypes = {
  children: PropTypes.func.isRequired,
};
