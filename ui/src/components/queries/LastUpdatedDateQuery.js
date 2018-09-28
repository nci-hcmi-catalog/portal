// @ts-check

import React from 'react';
import globals from 'utils/globals';
import Component from 'react-component-component';
import axios from 'axios';

const esQuery = {
  query: {
    match_all: {},
  },
  size: 1,
  sort: [
    {
      date: {
        order: 'desc',
      },
    },
  ],
};

const fetchData = async ({ setState }) => {
  try {
    const { data } = await axios.post(
      `${globals.ES_HOST}/${globals.ES_UPDATE_INDEX}/_search`,
      esQuery,
    );
    return setState({
      date: data.hits.hits[0]._source.date,
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
