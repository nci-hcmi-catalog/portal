import React, { useEffect, useState } from 'react';
import { useArrangerData } from '@overture-stack/arranger-components/';

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

const createSetsQuery = `mutation ($sqon: JSON!, $sort: [Sort]) {
  saveSet(sqon: $sqon, type: model, path:"name", sort: $sort) {
    sqon
    setId
    ids
  }
}`;

const SavedSetsProvider = (props) => {
  const [state, setState] = useState({
    sets: {},
    loading: false,
  });

  const { apiFetcher, isLoadingConfigs } = useArrangerData({ callerName: 'SavedSetsProvider' });
  useEffect(() => {
    setState({ loading: isLoadingConfigs });
  }, [isLoadingConfigs]);

  return (
    <SavedSetsContext.Provider
      value={{
        state,
        createSet: async ({ sqon, sort }) => {
          setState({ loading: true, sets: state.sets });
          const {
            data: {
              saveSet: { setId, ids },
            },
          } = await apiFetcher({
            endpointTag: 'CreateSets',
            body: {
              query: createSetsQuery,
              variables: { sqon, sort },
            },
          });
          setState({
            loading: false,
            sets: {
              ...state.sets,
              [setId]: { sqon, ids },
            },
          });
          return { setId, ids };
        },
        fetchSets: async ({ sqon }) => {
          setState({ loading: true, sets: state.sets });
          const { data } = await apiFetcher({
            endpointTag: 'FetchSets',
            body: { query: fetchSetsQuery, variables: { sqon } },
          });
          const { sets } = data;
          setState({
            loading: false,
            sets: {
              ...state.sets,
              ...(sets?.hits?.edges.reduce(
                (acc, { node: { setId, ids, sqon } }) => ({ ...acc, [setId]: { ids, sqon } }),
                {},
              ) || {}),
            },
          });
        },
        setSavedSets: ({ setId, ids, sqon }) =>
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
