import React from 'react';
import globals from 'utils/globals';
import { api } from '@arranger/components';
import Component from 'react-component-component';

const fetchData = async ({ setState, sqon, field }) => {
  const { data } = await api({
    endpoint: `${globals.VERSION}/graphql`,
    body: {
      query: `query ${field}Aggregation ($filters: JSON) {
        models {
          aggregations(filters: $filters) {
            ${field} {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }`,
      variables: {
        filters: sqon,
      },
    },
  });

  setState({ buckets: data.models.aggregations[field].buckets, loading: false });
};

export default ({ sqon, ...props }) => (
  <Component
    {...props}
    initialState={{ buckets: null, loading: true }}
    didMount={async ({ setState, props }) => {
      fetchData({ setState, sqon, field: props.field });
    }}
  />
);
