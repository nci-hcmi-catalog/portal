import React from 'react';
import Component from 'react-component-component';
import { useArrangerData } from '@overture-stack/arranger-components/';
import globals from 'utils/globals';
// import axios from 'axios';

// const fetchData = async ({ setState }) => {
//   try {
//     const { data } = await axios.get(`${globals.ARRANGER_API}/last-updated`);
//     return setState({
//       date: data.date,
//       loading: false,
//     });
//   } catch (err) {
//     return setState({
//       date: '',
//       error: err,
//       loading: false,
//     });
//   }
// };

const LastUpdatedDateQuery = ({ ...props }) => {
  const { ARRANGER_API } = globals;
  const context = useArrangerData({ apiUrl: ARRANGER_API, callerName: `LastUpdatedDateQuery` });
  const { apiFetcher } = context;
  return (
    <Component
      {...props}
      initialState={{ date: null, loading: true }}
      didMount={async ({ setState }) => {
        // const data = await apiFetcher({ endpoint: '/last-updated' });
        // console.log('last updated data', data);
      }}
    />
  );
};

export default LastUpdatedDateQuery;
