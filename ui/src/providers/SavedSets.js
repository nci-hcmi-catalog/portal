import React from 'react';
import { api } from '@arranger/components';
import globals from 'utils/globals';

export const SavedSetsContext = React.createContext();

class SavedSetsProvider extends React.Component {
  state = {
    sets: {},
    loading: false,
  };
  render() {
    return (
      <SavedSetsContext.Provider
        value={{
          state: this.state,
          createSet: async ({ sqon, sort }) => {
            this.setState({ loading: true, sets: this.state.sets });
            const {
              data: {
                saveSet: { setId, ids },
              },
            } = await api({
              endpoint: `${globals.VERSION}/graphql`,
              body: {
                query: `
                mutation ($sqon: JSON!, $sort: [Sort]) {
                  saveSet(sqon: $sqon type: "models" path:"name" sort:$sort) {
                    sqon
                    setId
                    ids
                  }
                }`,
                variables: {
                  sqon: sqon || {},
                  sort,
                },
              },
            });
            this.setState({
              loading: false,
              sets: {
                ...this.state.sets,
                [setId]: { sqon, ids },
              },
            });
            return { setId, ids };
          },
          fetchSets: async ({ sqon }) => {
            this.setState({ loading: true, sets: this.state.sets });
            const { data } = await api({
              endpoint: `${globals.VERSION}/graphql`,
              body: {
                query: `query($sqon: JSON) {
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
                }`,
                variables: {
                  sqon,
                },
              },
            });
            const { sets } = data;
            this.setState({
              loading: false,
              sets: {
                ...this.state.sets,
                ...sets.hits.edges.reduce(
                  (acc, { node: { setId, ids, sqon } }) => ({ ...acc, [setId]: { ids, sqon } }),
                  {},
                ),
              },
            });
          },
          setSet: ({ setId, ids, sqon }) =>
            this.setState({
              sets: {
                ...this.state.sets,
                [setId]: { ids, sqon },
              },
            }),
        }}
        {...this.props}
      />
    );
  }
}
export default SavedSetsProvider;
