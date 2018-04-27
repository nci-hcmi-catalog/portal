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
      >
        {this.props.children}
      </SavedSetsContext.Provider>
    );
  }
}
export default SavedSetsProvider;
