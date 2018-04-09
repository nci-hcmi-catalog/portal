import React from 'react';
import Component from 'react-component-component';
import { Link } from 'react-router-dom';
import Spinner from 'react-spinkit';

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
    {({ state }) => (
      <Row className="pagination" justifyContent="space-between">
        <div
          css={`
            border-right: solid 1px #cacbcf;
            padding: 6px 10px;
            min-width: 160px;
          `}
        >
          {state.loading ? (
            <Row className="loading" justifyContent="space-around">
              PREVIOUS: <Spinner fadeIn="half" name="circle" color="#900000" />
            </Row>
          ) : (
            <Link to={`/model/${state.prevName}`}>PREVIOUS: {state.prevName}</Link>
          )}
        </div>
        <Row width={300} justifyContent="center">
          Showing 1 of{' '}
          {state.loading ? (
            <Spinner fadeIn="half" name="circle" color="#900000" style={{ margin: '0 10px' }} />
          ) : (
            state.total.toLocaleString()
          )}{' '}
          Models
        </Row>
        <div
          css={`
            border-left: solid 1px #cacbcf;
            padding: 6px 10px;
            min-width: 160px;
          `}
        >
          {state.loading ? (
            <Row className="loading" justifyContent="space-around">
              Next: <Spinner fadeIn="half" name="circle" color="#900000" />
            </Row>
          ) : (
            <Link to={`/model/${state.nextName}`}>NEXT: {state.nextName}</Link>
          )}
        </div>
      </Row>
    )}
  </Component>
);
