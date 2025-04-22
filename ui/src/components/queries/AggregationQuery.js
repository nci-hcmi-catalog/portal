import React from 'react';
import { isEqual } from 'lodash';
import { api } from '@arranger/components';
import Component from 'react-component-component';

const fetchData = async ({ setState, sqon, field }) => {
  const { data } = await api({
    endpoint: `/graphql`,
    body: {
      query: `query ${field}Aggregation ($filters: JSON, $fields: [String]) {
        models {
          extended(fields: $fields)
          hits(filters: $filters) {
            total
          }
          aggregations(
            filters: $filters
            aggregations_filter_themselves: true
          ) {
            ${field} {
              buckets {
                doc_count
                key
                key_as_string
              }
            }
          }
        }
      }`,
      variables: {
        filters: sqon,
        fields: [field],
      },
    },
  });

  setState({
    total: data.models.hits.total,
    buckets: data.models.aggregations[field].buckets,
    extended: data.models.extended[0],
    loading: false,
  });
};

const AggregationQuery = ({ sqon, ...props }) => (
  <Component
    {...props}
    sqon={sqon}
    initialState={{ buckets: null, loading: true }}
    didMount={({ setState, props }) => {
      fetchData({ setState, sqon, field: props.field });
    }}
    didUpdate={({ setState, prevProps }) => {
      if (!isEqual(sqon, prevProps.sqon)) {
        fetchData({ setState, sqon, field: props.field });
      }
    }}
  />
);

export default AggregationQuery;
