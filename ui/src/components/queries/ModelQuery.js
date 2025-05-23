import React from 'react';
import { get } from 'lodash';

import Component from 'react-component-component';
import { useArrangerData } from '@overture-stack/arranger-components/';

const modelDataQuery = `query ModelDataQuery($sqon: JSON) {
  model {
    configs {
      extended(fieldNames: [])
    }
    hits(first: 1, filters: $sqon) {
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
}`;

const ModelQuery = ({ modelName, ...props }) => {
  const { apiFetcher } = useArrangerData({ callerName: `ModelQuery` });
  return (
    <Component
      {...props}
      modelName={modelName}
      initialState={{ model: null, loading: true, extended: [] }}
      didMount={async ({ setState }) => {
        const data = await apiFetcher({
          endpointTag: 'ModelDataQuery',
          body: {
            query: modelDataQuery,
            variables: {
              sqon: {
                content: [{ op: 'in', content: { fieldName: 'name', value: [modelName] } }],
                op: 'and',
              },
            },
          },
        }).catch((err) => {
          console.log(err);
        });

        const extendedMapping = get(data, `data.model.configs.extended`);
        setState({
          model: get(data, `data.model.hits.edges[0].node`, {}),
          extended: extendedMapping,
          loading: false,
        });
      }}
      didUpdate={async ({ setState, props, prevProps, state }) => {
        if (props.modelName !== prevProps.modelName && !state.loading) {
          setState({ loading: true });

          const data = await apiFetcher({
            endpointTag: 'ModelDataQuery',
            body: {
              query: modelDataQuery,
              variables: {
                sqon: {
                  content: [{ op: 'in', content: { fieldName: 'name', value: [props.modelName] } }],
                  op: 'and',
                },
              },
            },
          }).catch((err) => {
            console.log(err);
          });
          const extendedMapping = get(data, `data.model.configs.extended`);

          setState({
            model: get(data, `data.model.hits.edges[0].node`, {}),
            extended: extendedMapping,
            loading: false,
          });
        }
      }}
      shouldUpdate={({ state, props, nextProps, nextState }) =>
        state.loading !== nextState.loading || props.modelName !== nextProps.modelName
      }
    />
  );
};

export default ModelQuery;
