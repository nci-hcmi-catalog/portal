import React from 'react';
import Component from 'react-component-component';
import { Link } from 'react-router-dom';

import { api } from '@arranger/components';
import globals from 'utils/globals';
import { Row } from 'components/Layout';

const fetchData = async ({ setState, modelName }) => {
  const { data } = await api({
    endpoint: `${globals.VERSION}/graphql`,
    body: {
      query: `query($searchAfter: JSON) {
            models {
              total: hits{
                total
              }
              next: hits(sort: {field: "name", order: asc} searchAfter: $searchAfter offset:0 first:1) {
                edges {
                  node {
                    name
                  }
                }
              }
              prev: hits(sort: {field: "name", order: desc} searchAfter: $searchAfter offset:0 first:1) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }`,
      variables: {
        searchAfter: [modelName],
      },
    },
  });
  const { models } = data;
  setState({
    loading: false,
    total: models.total.total,
    prevName: models.prev.edges[0].node.name,
    nextName: models.next.edges[0].node.name,
  });
};

export default ({ modelName }) => (
  <Component
    modelName={modelName}
    initialState={{ prevName: null, nextName: null, total: 0, loading: true }}
    didMount={async ({ setState, props }) => {
      await fetchData({ setState, modelName: props.modelName });
    }}
    didUpdate={async ({ setState, props, prevProps, state }) => {
      if (props.modelName !== prevProps.modelName && !state.loading) {
        setState({ loading: true });
        await fetchData({ setState, modelName: props.modelName });
      }
    }}
    shouldUpdate={({ state, props, nextProps, nextState }) =>
      state.loading !== nextState.loading || props.modelName !== nextProps.modelName
    }
  >
    {({ state }) =>
      !state.loading ? (
        <Row className="pagination" justifyContent="space-between">
          <div
            css={`
              border-right: solid 1px #cacbcf;
              padding: 6px 10px;
            `}
          >
            <Link to={`/model/${state.prevName}`}>PREVIOUS: {state.prevName}</Link>
          </div>
          <div>Showing 1 of {state.total.toLocaleString()} Models</div>
          <div
            css={`
              border-left: solid 1px #cacbcf;
              padding: 6px 10px;
            `}
          >
            <Link to={`/model/${state.nextName}`}>NEXT: {state.nextName}</Link>
          </div>
        </Row>
      ) : (
        <div>loading</div>
      )
    }
  </Component>
);
