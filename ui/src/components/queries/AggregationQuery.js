import React from 'react';
import { isEqual } from 'lodash';
import { useArrangerData } from '@overture-stack/arranger-components/';
import Component from 'react-component-component';

const getQuery = (fieldName) =>
  `query ${fieldName}Aggregation ($filters: JSON) {
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

const AggregationQuery = ({ sqon, ...props }) => {
  const { fieldName } = props;
  const { apiFetcher } = useArrangerData({ callerName: 'HCMIAggregationQuery' });
  const queryName = `${fieldName}Aggregation`;
  const query = getQuery(fieldName);
  const options = {
    body: { sqon, query, queryName },
    endpointTag: `${queryName}Query`,
  };

  return (
    <Component
      {...props}
      sqon={sqon}
      initialState={{ buckets: null, loading: true }}
      didMount={async ({ setState, props }) => {
        const { data } = await apiFetcher(options).catch((err) => {
          console.log(err);
          throw err;
        });

        const aggregation = data?.model?.aggregations?.[props.fieldName];
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
          const { data } = await apiFetcher(options).catch((err) => {
            console.log(err);
            throw err;
          });

          const aggregation = data?.model?.aggregations?.[props.fieldName];
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
