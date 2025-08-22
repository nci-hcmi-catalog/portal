import React from 'react';
import axios from 'axios';
import Component from 'react-component-component';
import globals from '../../utils/globals';

const LastUpdatedDateQuery = ({ ...props }) => {
  return (
    <Component
      {...props}
      initialState={{ date: null, loading: true }}
      didMount={async ({ setState }) => {
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
      }}
    />
  );
};

export default LastUpdatedDateQuery;
