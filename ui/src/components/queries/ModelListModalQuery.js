import { get } from 'lodash';
import React from 'react';
import Component from 'react-component-component';
import { useArrangerData } from '@overture-stack/arranger-components/';

const modelListQuery = `query ModelListModal ($first: Int, $sqon: JSON) {
    model {
      configs {
        extended
      }
      hits(first: $first, filters: $sqon) {
      total
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
