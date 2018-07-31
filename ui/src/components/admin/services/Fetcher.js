import React from 'react';
import Component from 'react-component-component';
import axios from 'axios';

const fetchData = async({url, data, method}) => {
  return await axios({url, data, method});
};

export const get = async({url, params}) => {
  return await fetchData({url, params, method: 'get'});
};

export const post = async({url, data}) => {
  return await fetchData({url, params, method: 'post'})
};

export const Fetcher = ({url, data, method}) => (
  <Component
    initialState={{
    isLoading: true,
    data: null,
    error: null
  }}
    didMount={async({setState}) => {
    try {
      const response = await fetchData({url, data, method});
      setState(state => ({isLoading: false, data: response.data, error: null}));
    } catch (err) {
      setState(state => ({isLoading: false, data: null, error: err}));
    }
  }}/>