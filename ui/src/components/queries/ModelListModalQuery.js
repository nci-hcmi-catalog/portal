import React from 'react';
import { get } from 'lodash';

import { useArrangerData } from '@overture-stack/arranger-components/';

import Component from 'react-component-component';

const modelListQuery = `query ModelListModal ($first: Int, $sqon: JSON) {
    model {
      hits(first: $first, filters: $sqon) {
      total
      edges {
        node {
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

const ModelListModalQuery = ({ selected, ...props }) => {
  const { apiFetcher } = useArrangerData({
    callerName: `ModelListModalQuery`,
  });

  return (
    <Component
      {...props}
      initialState={{ models: [], loading: true }}
      selected={selected}
      didMount={async ({ setState }) => {
        const modelIds = selected?.state?.modelIds || [];
        const first = modelIds?.length || 0;
        const query = modelListQuery;

        const data = await apiFetcher({
          endpoint: '/graphql',
          endpointTag: 'ModelListModal',
          body: {
            query,
            variables: {
              first,
              sqon: { op: 'in', content: { fieldName: '_id', value: modelIds } },
            },
          },
        });

        const models = get(data, `data.model.hits.edges`, []).map((edge) => edge.node);

        setState({
          models,
          loading: false,
        });
      }}
      didUpdate={async ({ setState, props, prevProps, state }) => {
        // Currently we can only remove items from this component so
        // no need to query everytime we remove items from the list
        const newModelIds = props.selected.state.modelIds;

        if (newModelIds.length < prevProps.selected.state.modelIds.length && !state.loading) {
          setState((state) => ({
            models: state.models.filter((model) => newModelIds.indexOf(model.id) !== -1),
          }));
        }
      }}
    />
  );
};

export default ModelListModalQuery;
