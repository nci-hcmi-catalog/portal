import React from 'react';
import { get } from 'lodash';
import globals from 'utils/globals';
import { api } from '@arranger/components';
import Component from 'react-component-component';

const fetchData = async ({ setState, modelName }) => {
  const { data } = await api({
    endpoint: `${globals.VERSION}/graphql/ModelDataQuery`,
    body: {
      query: `query ModelDataQuery($filters: JSON) {
              models {
                extended
                hits(first: 1 filters: $filters) {
                  edges {
                    node {
                      id
                      source_model_url
                      source_sequence_url
                      name
                      type
                      split_ratio
                      growth_rate
                      primary_site
                      neoadjuvant_therapy
                      tnm_stage
                      molecular_characterizations
                      age_at_diagnosis
                      vital_status
                      gender
                      race
                      chemotherapeutic_drug_list_available
                      age_at_aquisition
                      disease_status
                      files {
                        hits{
                          edges {
                            node {
                              file_name
                              file_type
                            }
                          }
                        }
                      }
                      therapy
                      licensing_required
                      date_of_availability
                      createdAt
                      updatedAt
                      clinical_diagnosis {
                        clinical_tumor_diagnosis
                        aquisition_site
                        histological_type
                        histological_grade
                        clinical_stage_grouping
                      }
                    }
                  }
                }
              }
            }`,
      variables: {
        filters: { op: 'in', content: { field: 'name', value: [modelName] } },
      },
    },
  });
  setState({
    model: get(data, `models.hits.edges[0].node`, {}),
    extended: get(data, `models.extended`),
    loading: false,
  });
};

export default ({ modelName, ...props }) => (
  <Component
    {...props}
    modelName={modelName}
    initialState={{ model: null, loading: true, extended: [] }}
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
  />
);
