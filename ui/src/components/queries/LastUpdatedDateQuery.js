// @ts-check

import React from 'react';
import globals from 'utils/globals';
import Component from 'react-component-component';
import axios from 'axios';

const fetchData = async ({ setState }) => {
  try {
    const { data } = await axios.get(`${globals.ARRANGER_API}/last-updated`);
    return setState({
      date: data.date,
      loading: false,
    });
  } catch (err) {
    return setState({
      date: '',
      error: err,
      loading: false,
    });
  }
};

export default ({ ...props }) => (
  <Component
    {...props}
    initialState={{ date: null, loading: true }}
    didMount={async ({ setState }) => {
      await fetchData({ setState });
    }}
  />
);
