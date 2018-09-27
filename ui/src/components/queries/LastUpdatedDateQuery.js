// @ts-check

import React from 'react';
import globals from 'utils/globals';
import Component from 'react-component-component';
import axios from 'axios';

const fetchData = async ({ setState }) => {
  const { data } = await axios({
    url: `${globals.ES_HOST}/${globals.ES_UPDATE_INDEX}/_search`,
    data: {
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
    },
    method: 'post',
    headers: '',
  });
  setState({
    date: data,
    loading: false,
  });
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
