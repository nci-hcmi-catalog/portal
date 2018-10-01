// TODO: add faker annotations

export default ({ EXTENSIONS_KEY = '__extensions', FAKER_KEY = 'faker' } = {}) => ({
  variant_id: {
    type: 'keyword',
  },
  category: {
    type: 'keyword',
  },
  external_db_ids: {
    properties: {
      civic: {
        type: 'keyword',
      },
      cosmic: {
        type: 'keyword',
      },
    },
  },
  genes: {
    type: 'keyword',
  },
  models: {
    type: 'nested',
    properties: {
      age_at_diagnosis: {
        type: 'long',
      },
      age_at_acquisition: {
        type: 'long',
      },
      date_of_availability: {
        type: 'date',
        format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
      },
      createdAt: {
        type: 'date',
        format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
      },
      updatedAt: {
        type: 'date',
        format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
      },
      chemotherapeutic_drug_list_available: {
        type: 'boolean',
      },
      clinical_diagnosis: {
        properties: {
          site_of_sample_acquisition: {
            type: 'keyword',
          },
          clinical_tumor_diagnosis: {
            type: 'keyword',
          },
          clinical_stage_grouping: {
            type: 'keyword',
          },
          histological_grade: {
            type: 'keyword',
          },
          histological_type: {
            type: 'keyword',
          },
          histopathological_biomarkers: {
            type: 'keyword',
          },
        },
      },
      disease_status: {
        type: 'keyword',
      },
      gender: {
        type: 'keyword',
      },
      growth_rate: {
        type: 'long',
      },
      licensing_required: {
        type: 'boolean',
      },
      molecular_characterizations: {
        type: 'keyword',
      },
      name: {
        type: 'keyword',
      },
      neoadjuvant_therapy: {
        type: 'keyword',
      },
      tnm_state_t: {
        type: 'keyword',
      },
      tnm_stage_n: {
        type: 'keyword',
      },
      tnm_stage_m: {
        type: 'keyword',
      },
      primary_site: {
        type: 'keyword',
      },
      race: {
        type: 'keyword',
      },
      source: {
        type: 'keyword',
      },
      source_model_url: {
        type: 'keyword',
      },
      source_sequence_url: {
        type: 'keyword',
      },
      split_ratio: {
        type: 'keyword',
      },
      therapy: {
        type: 'keyword',
      },
      type: {
        type: 'keyword',
      },
      vital_status: {
        type: 'keyword',
      },
    },
  },
  name: {
    type: 'keyword',
  },
  type: {
    type: 'keyword',
  },
});
