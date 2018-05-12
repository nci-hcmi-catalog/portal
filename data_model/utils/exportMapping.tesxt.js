import exportMapping from './exportMapping';

let properties = {
  age_at_diagnosis: {
    type: 'long',
    faker: {
      $ref: '#/definitions/age',
    },
  },
  age_at_aquisition: {
    type: 'long',
    faker: {
      $ref: '#/definitions/age',
    },
  },
  date_of_availability: {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
    faker: {
      pattern: '2018-06-06 10:00:00',
    },
  },
  date_created: {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
    faker: {
      pattern:
        '2018-01-01 10:00:00|2018-02-01 10:00:00|2018-01-03 10:00:00|2018-02-20 10:00:00|2018-03-01 10:00:00|2018-03-03 10:00:00|2018-02-02 10:00:00|2018-02-10 10:00:00',
    },
  },
  date_updated: {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
    faker: {
      pattern:
        '2018-04-01 10:00:00|2018-05-01 10:00:00|2018-04-03 10:00:00|2018-05-20 10:00:00|2018-04-01 10:00:00|2018-05-05 10:00:00|2018-05-02 10:00:00|2018-05-10 10:00:00',
    },
  },
  chemotherapeutic_drug_list_available: {
    type: 'boolean',
  },
  clinical_diagnosis: {
    properties: {
      aquisition_site: {
        type: 'keyword',
        faker: { pattern: 'Pancreatic head|Liver|Kidney|lung|Other|Brain' },
      },
      clinical_tumor_diagnosis: {
        type: 'keyword',
        faker: {
          pattern: 'Esophageous|Pancreas|Neuroblastoma|Wilms Tumor|Ewing Sarcoma|Glioblastoma',
        },
      },
      clinical_stage_grouping: {
        type: 'keyword',
        faker: {
          pattern: 'Stage I|Stage IA|Stage IB|Stage IIA|Stage IIB|Stage III|Stage IV',
        },
      },
      histologcal_grade: {
        type: 'keyword',
        faker: { pattern: '1|2|3|4' },
      },
      histological_type: {
        type: 'keyword',
        faker: { pattern: 'Favorable|Unfavorable|Unknown' },
      },
      histopathological_biomarkers: {
        type: 'keyword',
        faker: {
          isArray: true,
          minItems: 2,
          pattern:
            'EWSR1-PBX1|EWSR1-ZNF444|EWSR1-POU5F1|CD99 positive|RET rearranged|PTEN negative',
        },
      },
    },
  },
  disease_status: {
    type: 'keyword',
    faker: {
      pattern:
        'Disease Free|Progression (no response to treatment)|Relapse (patient responded to treatment)|Unknown / lost to followup',
    },
  },
  files: {
    type: 'nested',
    faker: {
      minItems: 1,
    },
    properties: {
      file_type: {
        type: 'keyword',
        faker: {
          pattern: 'image',
        },
      },
      file_name: {
        type: 'keyword',
        faker: {
          pattern: 'imagefile',
        },
      },
    },
  },
  gender: {
    type: 'keyword',
    faker: {
      pattern: 'Female|Male|Unspecified|Unknown',
    },
  },
  growth_rate: {
    type: 'long',
    faker: {
      $ref: '#/definitions/growthRate',
    },
  },
  licensing_required: {
    type: 'boolean',
  },
  molecular_characterizations: {
    type: 'keyword',
    faker: {
      pattern:
        'Whole Genome Sequencing (WGS) of parent tumor|WGS of normal|WGS of Model|Whole Exome Sequencing (WXS) of parent tumor|WXS of normal|WXS of model|Targeted sequencing of parent tumor|Targeted sequencing of normal|Targeted sequencing of model|RNA-seq of parent tumor|RNA-seq of model',
    },
  },
  name: {
    type: 'keyword',
    faker: { pattern: '[A-Z]{4}-[a-z]{4}' },
  },
  neoadjuvant_therapy: {
    type: 'keyword',
    faker: {
      pattern: 'Y|N',
    },
  },
  tnm_state_t: {
    type: 'keyword',
    faker: { pattern: 'T0|T1|T2' },
  },
  tnm_stage_n: {
    type: 'keyword',
    faker: { pattern: 'N0|N1|N2|N3|N4' },
  },
  tnm_stage_m: {
    type: 'keyword',
    faker: { pattern: 'M0|M1|M2' },
  },
  primary_site: {
    type: 'keyword',
    faker: {
      pattern:
        'Adrenal Gland|Bile Duct|Bladder|Blood|Bone|Bone Marrow|Brain|Breast|Cervix|Colorectal|Esophagus|Eye|Head and Neck|Kidney|Liver|Lung|Lymph Nodes|Nervous System|Ovary|Pancreas|Pleura|Prostate|Skin|Soft Tissue|Stomach|Testis|Thymus|Thyroid|Uter',
    },
  },
  race: {
    type: 'keyword',
    faker: {
      pattern:
        ' American Indian or Alaskan Native|Asian|Black or African American|Native Hawaiian or other Pacific Islander|White|Not Reported|Unknown',
    },
  },
  source: {
    type: 'keyword',
    faker: {
      pattern: 'GDC|EGA',
    },
  },
  source_model_url: {
    type: 'keyword',
    faker: {
      pattern: 'https://portal.gdc.cancer.gov/cases/4abbd258-0f0c-4428-901d-625d47ad363a',
    },
  },
  source_sequence_url: {
    type: 'keyword',
    faker: {
      pattern:
        'https://portal.gdc.cancer.gov/repository?facetTab=cases&filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases.case_id%22%2C%22value%22%3A%5B%2230bc72d5-07b5-48d2-b025-bba9bcf2f09f%22%5D%7D%7D%5D%7D',
    },
  },
  split_ratio: {
    type: 'keyword',
    faker: {
      pattern: '1:2|1:4|1:8',
    },
  },
  variants: {
    type: 'nested',
    faker: {
      minItems: 5,
    },
    properties: {
      category: {
        type: 'keyword',
        faker: {
          pattern: 'Clinical Sequencing|Genomic Sequencing|Histopathological Sequencing',
        },
      },
      external_db_ids: {
        properties: {
          civic: {
            type: 'keyword',
            faker: {
              pattern: '[0-9]{4}',
            },
          },
          cosmic: {
            type: 'keyword',
            faker: {
              chance: 'guid',
            },
          },
        },
      },
      genes: {
        properties: {
          gene_symbol: {
            type: 'keyword',
            faker: {
              isArray: true,
              minItems: 1,
              maxItems: 2,
              pattern:
                'BRAF|BCOR|SWST|ETV1|RET|PAX3|PAX7|FOX01|PBX1|FUS|BRAF|KRAS|TP53|EGFR|H3|H3_1|MEDD1010|ALK|ELK|CDKN2A|PIK3CA|MET',
            },
          },
        },
      },
      name: {
        type: 'keyword',
        faker: {
          pattern: 'placeholder',
        },
      },
      type: {
        type: 'keyword',
        faker: {
          pattern: 'SNV|Indel|Fusion',
        },
      },
    },
  },
  therapy: {
    type: 'keyword',
    faker: {
      pattern:
        'Targeted therapy (small molecule inhibitors and targeted antibodies)|Immunotherapy (cellular and immune checkpoint)|Hormonal therapy|Radiation therapy|Other|None',
    },
  },
  type: {
    type: 'keyword',
    faker: {
      pattern:
        '3-D: Organoid|3-D: Other|2-D: Conditionally reprogrammed cells|2-D: Adherent|2-D: Suspension',
    },
  },
  vital_status: {
    type: 'keyword',
    faker: {
      pattern: 'Alive|Deceased|Unknown / lost to followup',
    },
  },
};

let settings = {
  analysis: {
    analyzer: {
      autocomplete_analyzed: {
        filter: ['lowercase', 'edge_ngram'],
        tokenizer: 'standard',
      },
      autocomplete_prefix: {
        filter: ['lowercase', 'edge_ngram'],
        tokenizer: 'keyword',
      },
      lowercase_keyword: {
        filter: ['lowercase'],
        tokenizer: 'keyword',
      },
    },
    filter: {
      edge_ngram: {
        max_gram: '20',
        min_gram: '1',
        side: 'front',
        type: 'edge_ngram',
      },
    },
  },
  'index.mapping.nested_fields.limit': 100,
  'index.max_result_window': 100000000,
};

let validMapping = {
  mappings: {
    model_test: {
      properties: {
        age_at_diagnosis: {
          type: 'long',
        },
        age_at_aquisition: {
          type: 'long',
        },
        date_of_availability: {
          type: 'date',
          format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
        },
        date_created: {
          type: 'date',
          format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
        },
        date_updated: {
          type: 'date',
          format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
        },
        chemotherapeutic_drug_list_available: {
          type: 'boolean',
        },
        clinical_diagnosis: {
          properties: {
            aquisition_site: {
              type: 'keyword',
            },
            clinical_tumor_diagnosis: {
              type: 'keyword',
            },
            clinical_stage_grouping: {
              type: 'keyword',
            },
            histologcal_grade: {
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
        files: {
          type: 'nested',
          properties: {
            file_type: {
              type: 'keyword',
            },
            file_name: {
              type: 'keyword',
            },
          },
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
        variants: {
          type: 'nested',
          properties: {
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
              properties: {
                gene_symbol: {
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
          },
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
  },
  settings: {
    analysis: {
      analyzer: {
        autocomplete_analyzed: {
          filter: ['lowercase', 'edge_ngram'],
          tokenizer: 'standard',
        },
        autocomplete_prefix: {
          filter: ['lowercase', 'edge_ngram'],
          tokenizer: 'keyword',
        },
        lowercase_keyword: {
          filter: ['lowercase'],
          tokenizer: 'keyword',
        },
      },
      filter: {
        edge_ngram: {
          max_gram: '20',
          min_gram: '1',
          side: 'front',
          type: 'edge_ngram',
        },
      },
    },
    'index.mapping.nested_fields.limit': 100,
    'index.max_result_window': 100000000,
  },
};

test('Mapping transformed correctly (faker keys removed)', () => {
  let mapping = exportMapping({
    name: 'model_test',
    properties,
    settings,
  });

  expect(mapping).toEqual(validMapping);
});
