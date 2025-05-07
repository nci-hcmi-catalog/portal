import React from 'react';
// import { get } from 'lodash';

import { useDataContext } from '@overture-stack/arranger-components/dist/DataContext';
import globals from 'utils/globals';
import Component from 'react-component-component';

// const fetchData = async ({ setState, modelIds }) => {
//   const { data } = await api({
//     endpoint: `/graphql/ModelDataQuery`,
//     body: {

const query = (count) => `query ModelListModal($filters: JSON) {
            models {
              extended
              hits(first: ${count} filters: $filters) {
                edges {
                  node {
                    id
                    expanded
                    proteomics_url
                    source_model_url
                    source_sequence_url
                    somatic_maf_url
                    name
                    type
                    split_ratio
                    growth_rate
                    primary_site
                    neoadjuvant_therapy
                    tnm_stage
                    molecular_characterizations
                    age_at_sample_acquisition
                    vital_status
                    gender
                    race
                    chemotherapeutic_drugs
                    age_at_sample_acquisition
                    disease_status
                    files {
                      hits{
                        edges {
                          node {
                            file_id
                            file_url
                            file_name
                            file_type
                          }
                        }
                      }
                    }
                    therapy
                    licensing_required
                    date_of_availability
                    clinical_diagnosis {
                      clinical_tumor_diagnosis
                      site_of_sample_acquisition
                      histological_type
                      tumor_histological_grade
                      clinical_stage_grouping
                    }
                    matched_models {
                      hits{
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
          }`;

//       variables: {
//         filters: { op: 'in', content: { field: '_id', value: modelIds } },
//       },
//     },
//   });
//   setState({
//     models: get(data, `models.hits.edges`, []).map((edge) => edge.node),
//     loading: false,
//   });
// };

const ModelListModalQuery = ({ selected, ...props }) => {
  const { ARRANGER_API } = globals;
  const context = useDataContext({
    apiUrl: ARRANGER_API,
    callerName: `ModelListModalQuery`,
  });
  const { apiFetcher } = context;
  return (
    <Component
      {...props}
      initialState={{ models: [], loading: true }}
      selected={selected}
      didMount={async ({ setState }) => {
        const count = selected?.state?.modelIds?.length || 0;
        const data = await apiFetcher({
          endpoint: '/graphql/ModelDataQuery',
          body: { query: query(count), queryName: 'ModelDataQuery' },
        });
      }}
      didUpdate={async ({ setState, props, prevProps, state }) => {
        // Currently we can only remove items from this component so
        // no need to query everytime we remove items from the list
        const newModelId = props.selected.state.modelIds;
        if (newModelId.length < prevProps.selected.state.modelIds.length && !state.loading) {
          setState((state) => ({
            models: state?.models.filter((model) => newModelId.indexOf(model.id) !== -1),
          }));
        }
      }}
    />
  );
};

export default ModelListModalQuery;
