import React from 'react';
import { get } from 'lodash';
import { api } from '@arranger/components';
import Component from 'react-component-component';

const fetchData = async ({ setState, modelName }) => {
  const { data } = await api({
    endpoint: `/graphql/ModelDataQuery`,
    body: {
      query: `query ModelDataQuery($filters: JSON) {
              models {
                extended
                hits(first: 1 filters: $filters) {
                  edges {
                    node {
                      id
                      expanded
                      distributor_part_number
                      proteomics_url
                      source_model_url
                      source_sequence_url
                      somatic_maf_url
                      name
                      type
                      split_ratio
                      time_to_split
                      growth_rate
                      primary_site
                      neoadjuvant_therapy
                      tnm_stage
                      molecular_characterizations
                      age_at_diagnosis
                      age_at_sample_acquisition
                      vital_status
                      gender
                      race
                      chemotherapeutic_drugs
                      disease_status
                      tissue_type
                      files {
                        hits{
                          edges {
                            node {
                              file_id
                              file_url
                              file_name
                              file_type
                              scale_bar_length
                              magnification
                              passage_number
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
                        site_of_sample_acquisition
                        histological_type
                        tumor_histological_grade
                        clinical_stage_grouping
                      }
                      matched_models {
                        hits {
                          edges {
                            node {
                              name
                              tissue_type
                            }
                          }
                        }
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

const ModelQuery = ({ modelName, ...props }) => (
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

export default ModelQuery;
