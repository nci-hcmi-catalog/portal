import React from 'react';
import { isEqual } from 'lodash';
import { useDataContext } from '@overture-stack/arranger-components/dist/DataContext';
import globals from 'utils/globals';
import Component from 'react-component-component';

const fetchAggregationData = async ({ apiFetcher, field, sqon }) => {
  const queryName = `${field}Aggregation`;
  const query = `query ${field}Aggregation ($filters: JSON) {
      file {
        aggregations(
          filters: $filters
          aggregations_filter_themselves: true
        ) {
          ${field} {
            bucket_count
            buckets {
              doc_count
              key
              key_as_string
            }
          }
        }
      }
    }`;

  const { data } = await apiFetcher({
    body: { sqon, query, queryName },
    endpoint: '/graphql',
  }).catch((err) => {
    console.log(err);
    throw err;
  });

  return data;
};

const AggregationQuery = ({ sqon, ...props }) => {
  const { field } = props;
  const { ARRANGER_API } = globals;
  const context = useDataContext({ apiUrl: ARRANGER_API, callerName: 'AggregationQuery' });
  const { apiFetcher } = context;
  return (
    <Component
      {...props}
      sqon={sqon}
      initialState={{ buckets: null, loading: true }}
      didMount={async ({ setState, props }) => {
        const { data } = await fetchAggregationData({ apiFetcher, field, sqon });
        const aggregation = data?.file?.aggregations?.[props.field];
        const update = aggregation
          ? {
              total: aggregation.bucket_count,
              buckets: aggregation.buckets,
            }
          : {
              total: 0,
              buckets: [],
            };

        setState({ ...update, loading: false });
      }}
      didUpdate={async ({ setState, prevProps }) => {
        if (!isEqual(sqon, prevProps.sqon)) {
          const { data } = await fetchAggregationData({ apiFetcher, field, sqon });
          const aggregation = data?.data?.file?.aggregations?.[props.field];
          const update = aggregation
            ? {
                total: aggregation.bucket_count,
                buckets: aggregation.buckets,
              }
            : {
                total: 0,
                buckets: [],
              };

          setState({ ...update, loading: false });
        }
      }}
    />
  );
};

export default AggregationQuery;
