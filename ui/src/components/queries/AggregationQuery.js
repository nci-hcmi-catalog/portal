import React from 'react';
import { isEqual } from 'lodash';
import { useDataContext } from '@overture-stack/arranger-components/dist/DataContext';
import Component from 'react-component-component';

const fetchAggregationData = async ({ apiFetcher, fieldName, sqon }) => {
  const queryName = `${fieldName}Aggregation`;
  const query = `query ${queryName} ($filters: JSON) {
      model {
        aggregations(
          filters: $filters
          aggregations_filter_themselves: true
        ) {
          ${fieldName} {
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
    endpointTag: `${queryName}Query`,
  }).catch((err) => {
    console.log(err);
    throw err;
  });

  return data;
};

const AggregationQuery = ({ sqon, ...props }) => {
  const { field } = props;
  const { apiFetcher } = useDataContext({ callerName: 'HCMIAggregationQuery' });

  return (
    <Component
      {...props}
      sqon={sqon}
      initialState={{ buckets: null, loading: true }}
      didMount={async ({ setState, props }) => {
        const { data } = await fetchAggregationData({ apiFetcher, fieldName: field, sqon });
        const aggregation = data?.model?.aggregations?.[props.field];
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
          const { data } = await fetchAggregationData({ apiFetcher, fieldName: field, sqon });
          const aggregation = data?.model?.aggregations?.[props.field];
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
