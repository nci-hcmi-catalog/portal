import { get } from 'lodash';
import clinical_sequencing_map from './clinical_sequencing_map';

export default ({ EXTENSIONS_KEY = '__extensions', FAKER_KEY = 'faker' } = {}) => ({
  age_at_diagnosis: {
    type: 'long',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: { min: 10, max: 10950 },
    },
  },
  age_at_aquisition: {
    type: 'long',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: { min: 10, max: 10950 },
    },
  },
  date_of_availability: {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['2018-06-06 10:00:00'],
    },
  },
  date_created: {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: [
        '2018-01-01 10:00:00',
        '2018-02-01 10:00:00',
        '2018-01-03 10:00:00',
        '2018-02-20 10:00:00',
        '2018-03-01 10:00:00',
        '2018-03-03 10:00:00',
        '2018-02-02 10:00:00',
        '2018-02-10 10:00:00',
      ],
    },
  },
  date_updated: {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: [
        '2018-04-01 10:00:00',
        '2018-05-01 10:00:00',
        '2018-04-03 10:00:00',
        '2018-05-20 10:00:00',
        '2018-04-01 10:00:00',
        '2018-05-05 10:00:00',
        '2018-05-02 10:00:00',
        '2018-05-10 10:00:00',
      ],
    },
  },
  chemotherapeutic_drug_list_available: {
    type: 'boolean',
  },
  clinical_diagnosis: {
    properties: {
      aquisition_site: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['Pancreatic head', 'Liver', 'Kidney', 'lung', 'Other', 'Brain'],
        },
      },
      clinical_tumor_diagnosis: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: [
            'Esophageous',
            'Pancreas',
            'Neuroblastoma',
            'Wilms Tumor',
            'Ewing Sarcoma',
            'Glioblastoma',
          ],
        },
      },
      clinical_stage_grouping: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: [
            'Stage I',
            'Stage IA',
            'Stage IB',
            'Stage IIA',
            'Stage IIB',
            'Stage III',
            'Stage IV',
          ],
        },
      },
      histologcal_grade: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['1', '2', '3', '4'],
        },
      },
      histological_type: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['Favorable', 'Unfavorable', 'Unknown'],
        },
      },
    },
  },
  disease_status: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: [
        'Disease Free',
        'Progression (no response to treatment)',
        'Relapse (patient responded to treatment)',
        'Unknown / lost to followup',
      ],
    },
  },
  files: {
    type: 'nested',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: {
        min: 1,
        max: 3,
      },
    },
    properties: {
      file_type: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['image/jpeg', 'image/jpeg', 'image/jpeg'],
        },
      },
      file_name: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: [
            'https://object.cancercollaboratory.org:9080/swift/v1/hcmi-demo-images/Organoid%201.jpg',
            'https://object.cancercollaboratory.org:9080/swift/v1/hcmi-demo-images/Organoid%202.jpg',
            'https://object.cancercollaboratory.org:9080/swift/v1/hcmi-demo-images/Organoid%203.jpg',
          ],
        },
      },
    },
  },
  gender: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['Female', 'Male', 'Unspecified', 'Unknown'],
    },
  },
  growth_rate: {
    type: 'long',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: {
        min: 1,
        max: 90,
      },
    },
  },
  licensing_required: {
    type: 'boolean',
  },
  molecular_characterizations: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: [
        'Whole Genome Sequencing (WGS) of parent tumor',
        'WGS of normal',
        'WGS of Model',
        'Whole Exome Sequencing (WXS) of parent tumor',
        'WXS of normal',
        'WXS of model',
        'Targeted sequencing of parent tumor',
        'Targeted sequencing of normal',
        'Targeted sequencing of model',
        'RNA-seq of parent tumor',
        'RNA-seq of model',
      ],
    },
  },
  name: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: /[A-Z]{4}-[a-z]{4}/,
    },
  },
  neoadjuvant_therapy: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['Y', 'N'],
    },
  },
  tnm_stage: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['T0N0M1', 'T1N0M1', 'T2N0M2'],
    },
  },
  primary_site: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: [
        'Adrenal Gland',
        'Bile Duct',
        'Bladder',
        'Blood',
        'Bone',
        'Bone Marrow',
        'Brain',
        'Breast',
        'Cervix',
        'Colorectal',
        'Esophagus',
        'Eye',
        'Head and Neck',
        'Kidney',
        'Liver',
        'Lung',
        'Lymph Nodes',
        'Nervous System',
        'Ovary',
        'Pancreas',
        'Pleura',
        'Prostate',
        'Skin',
        'Soft Tissue',
        'Stomach',
        'Testis',
        'Thymus',
        'Thyroid',
        'Uter',
      ],
    },
  },
  race: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: [
        'American Indian or Alaskan Native',
        'Asian',
        'Black or African American',
        'Native Hawaiian or other Pacific Islander',
        'White',
        'Not Reported',
        'Unknown',
      ],
    },
  },
  source: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['GDC', 'EGA'],
    },
  },
  source_model_url: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: 'https://portal.gdc.cancer.gov/cases/4abbd258-0f0c-4428-901d-625d47ad363a',
    },
  },
  source_sequence_url: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]:
        'https://portal.gdc.cancer.gov/repository?facetTab=cases&filters=%7B%22op%22%3A%22and%22%2C%22content%22%3A%5B%7B%22op%22%3A%22in%22%2C%22content%22%3A%7B%22field%22%3A%22cases.case_id%22%2C%22value%22%3A%5B%2230bc72d5-07b5-48d2-b025-bba9bcf2f09f%22%5D%7D%7D%5D%7D',
    },
  },
  split_ratio: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['1:2', '1:4', '1:8'],
    },
  },
  variants: {
    type: 'nested',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: {
        min: 1,
        max: 25,
      },
    },
    properties: {
      genes: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: {
            min: 1,
            max: 2,
            enum: Object.keys(clinical_sequencing_map),
          },
        },
      },
      name: {
        type: `keyword`,
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ({ path, context }) => {
            let { genes } = get(context, path);
            return clinical_sequencing_map[genes[0]] || 'Unknown';
          },
        },
      },
      category: {
        type: `keyword`,
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['clinical_sequencing', 'histopathological_biomarker', 'genomic_sequencing'],
        },
      },
      type: {
        type: `keyword`,
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['SNV', 'Indel', 'transolocation'],
        },
      },
      assessment_type: {
        type: `keyword`,
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['IHC', 'CISH', 'FISH', 'Pyrosequencing/methylation-specific PCR'],
        },
      },
      expression_level: {
        type: `keyword`,
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: ['Positive', 'Negative', 'Equivocal'],
        },
      },
    },
  },
  therapy: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: [
        'Targeted therapy (small molecule inhibitors and targeted antibodies)',
        'Immunotherapy (cellular and immune checkpoint)',
        'Hormonal therapy',
        'Radiation therapy',
        'Other',
        'None',
      ],
    },
  },
  type: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: [
        '3-D: Organoid',
        '3-D: Other',
        '2-D: Conditionally reprogrammed cells',
        '2-D: Adherent',
        '2-D: Suspension',
      ],
    },
  },
  vital_status: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['Alive', 'Deceased', 'Unknown / lost to followup'],
    },
  },
});
