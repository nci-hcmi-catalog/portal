import React, { useState } from 'react';
import globals from 'utils/globals';
import { useDataContext } from '@overture-stack/arranger-components/dist/DataContext';

export const SavedSetsContext = React.createContext();

const fetchSetsQuery = `query($sqon: JSON) {
  sets {
    hits(filters: $sqon) {
      edges {
        node {
          ids
          setId
          sqon
        }
      }
    }
  }
}`;

const SavedSetsProvider = (props) => {
  const [state, setState] = useState({
    sets: {},
    loading: false,
  });

  const { ARRANGER_API } = globals;
  const { apiFetcher } = useDataContext({ apiUrl: ARRANGER_API, callerName: 'AggregationQuery' });
  return (
    <SavedSetsContext.Provider
      value={{
        state,
        createSet: async ({ sqon, sort }) => {
          setState({ loading: true, sets: this.state.sets });
          const {
            data: {
              saveSet: { setId, ids },
            },
          } = await apiFetcher({ query: fetchSetsQuery, sqon });
          // await api({
          //   endpoint: `/graphql`,
          //   body: {
          //     query: `
          //     mutation ($sqon: JSON!, $sort: [Sort]) {
          //       saveSet(sqon: $sqon type: models path:"name" sort:$sort) {
          //         sqon
          //         setId
          //         ids
          //       }
          //     }`,
          //     variables: {
          //       sqon: sqon || {},
          //       sort,
          //     },
          //   },
          // });
          setState({
            loading: false,
            sets: {
              ...this.state.sets,
              [setId]: { sqon, ids },
            },
          });
          return { setId, ids };
        },
        fetchSets: async ({ sqon }) => {
          setState({ loading: true, sets: this.state.sets });
          const { data } = await apiFetcher({ query: fetchSetsQuery, sqon });
          console.log('sets data', data);
          const { sets } = data;
          setState({
            loading: false,
            sets: {
              ...state.sets,
              // ...sets.hits.edges.reduce(
              //   (acc, { node: { setId, ids, sqon } }) => ({ ...acc, [setId]: { ids, sqon } }),
              //   {},
              // ),
            },
          });
        },
        setSet: ({ setId, ids, sqon }) =>
          setState({
            sets: {
              ...state.sets,
              [setId]: { ids, sqon },
            },
          }),
      }}
      {...props}
    />
  );
};
export default SavedSetsProvider;
