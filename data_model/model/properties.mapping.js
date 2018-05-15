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
      histopathological_biomarkers: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: {
            min: 2,
            max: 10,
            enum: [
              'EWSR1-PBX1',
              'EWSR1-ZNF444',
              'EWSR1-POU5F1',
              'CD99 positive',
              'RET rearranged',
              'PTEN negative',
            ],
          },
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
        max: 10,
      },
    },
    properties: {
      file_type: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: 'image',
        },
      },
      file_name: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: 'imagefile',
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
  tnm_state_t: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['T0', 'T1', 'T2'],
    },
  },
  tnm_stage_n: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['N0', 'N1', 'N2', 'N3', 'N4'],
    },
  },
  tnm_stage_m: {
    type: 'keyword',
    [EXTENSIONS_KEY]: {
      [FAKER_KEY]: ['M0', 'M1', 'M2'],
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
  genes: {type: 'nested',
    properties: {
      gene_symbol: {
        type: 'keyword',
        [EXTENSIONS_KEY]: {
          [FAKER_KEY]: {
            min: 5,
            max: 20,
            enum: [
              'BRAF',
              'BCOR',
              'SWST',
              'ETV1',
              'RET',
              'PAX3',
              'PAX7',
              'FOX01',
              'PBX1',
              'FUS',
              'BRAF',
              'KRAS',
              'TP53',
              'EGFR',
              'H3',
              'H3_1',
              'MEDD1010',
              'ALK',
              'ELK',
              'CDKN2A',
              'PIK3CA',
              'MET',
            ],
          },
      variants: {
        type: `nested`,
        properties: {
          clinical_sequencing: {
            type: `nested`,
            properties: {
              name: {
                type: `keyword`,
                [EXTENSIONS_KEY]: {
                  [FAKER_KEY]: {
                    min: 5,
                    max: 20,
                    enum: [
                      'ALK F1174C',
                      'ALK F1174L',
                      'ALK F1174V',
                      'ALK F1245L',
                      'ALK K1062M',
                      'ALK R1275Q',
                      'ALK T1087I',
                      'BRAF K601E',
                      'BRAF V600D',
                      'BRAF V600E',
                      'BRAF V600K',
                      'BRAF V600R',
                      'CDKN2A A147T',
                      'CDKN2A A148T',
                      'CDKN2A A30V',
                      'CDKN2A D108H',
                      'CDKN2A D108Y',
                      'CDKN2A H83P',
                      'CDKN2A H83Y',
                      'CDKN2A L130Q',
                      'CDKN2A V51D',
                      'CDKN2A V51I',
                      'EGFR C797S',
                      'EGFR G719X',
                      'EGFR L858R',
                      'EGFR L861Q',
                      'EGFR T790M',
                      'GNAS Q125R',
                      'GNAS Q227E',
                      'GNAS Q227L',
                      'GNAS Q227P',
                      'GNAS Q227R',
                      'GNAS R160C',
                      'GNAS R201C',
                      'GNAS R201H',
                      'GNAS R201S',
                      'IDH1 R132C',
                      'IDH1 R132G',
                      'IDH1 R132H',
                      'IDH1 R132H',
                      'IDH1 R132L',
                      'IDH1 R132S',
                      'IDH2 R172K',
                      'IDH2 R172M',
                      'IDH2 R172W',
                      'KRAS A146T',
                      'KRAS G12A',
                      'KRAS G12C',
                      'KRAS G12D',
                      'KRAS G12R',
                      'KRAS G12S',
                      'KRAS G12V',
                      'KRAS G13A',
                      'KRAS G13C',
                      'KRAS G13D',
                      'KRAS G13R',
                      'KRAS G13V',
                      'KRAS Q61H',
                      'KRAS Q61L',
                      'MET D1010N',
                      'RNF43 A169T',
                      'RNF43 D140E',
                      'RNF43 E318D',
                      'RNF43 P154L',
                      'RNF43 R127P',
                      'TP53 C238Y',
                      'TP53 G245D',
                      'TP53 G245S',
                      'TP53 G266E',
                      'TP53 G266V',
                      'TP53 R175H',
                      'TP53 R213L',
                      'TP53 R248Q',
                      'TP53 R248W',
                      'TP53 R273C',
                      'TP53 R273H',
                      'TP53 R273L',
                      'TP53 R282G',
                      'TP53 R282W',
                      'TP53 V272M',
                      'TP53 Y220C',
                      'EGFR Exon 19 deletion',
                      'EGFR Exon 20 insertion',
                      'H3.1 mutation',
                      'H3.3 mutation',
                      'MET D1010 splice mutation',
                      'MET D963 splice mutation',
                      'MET Exon 14 deletion',
                      'MET Exon 14 mutation',
                      'MET Intron 13 mutation',
                      'MET Intron 14 mutation',
                      'PIK3CA exon 20 mutation',
                      'PIK3CA exon 9 mutation',
                      'PTEN exon 1-9 mutation',
                      'BCOR-CCNB3',
                      'CIC-DUX4',
                      'EML4-ALK translocation variant 1',
                      'EML4-ALK translocation variant 2',
                      'EML4-ALK translocation variant 3',
                      'EML4-ALK translocation variant 4',
                      'EML4-ALK translocation variant 5',
                      'EWSR1-ATF1',
                      'EWSR1-CREB1',
                      'EWSR1-ETV1',
                      'EWSR1-ETV4',
                      'EWSR1-PBX1',
                      'EWSR1-POU5F1',
                      'EWSR1-ZNF444',
                      'FOXO1 rearranged (FOXO1 with unknown partner)',
                      'FUS-CREB3L2',
                      'PAX3 - FOXO1 ',
                      'PAX7 - FOXO1',
                      'RET rearranged',
                      'ROS1 rearranged',   
                    ],
                },
              },
              type: {
                type: `keyword`,
                [EXTENSIONS_KEY]: {
                  [FAKER_KEY]: ['SNV', 'Indel', 'transolocation'],
              }
            }
          },
          histopathological_biomarkers: {
            type: `nested`,
              properties: {
                name: {
                  type: `keyword`,
                  [EXTENSIONS_KEY]: {
                    [FAKER_KEY]: {
                      min: 1,
                      max: 20,
                      enum: [
                      'BRAF',
                      'CD99',
                      'Estrogen receptor',
                      'H3 K27M',
                      'HER2',
                      'HER2',
                      'IDH1 R132H',
                      'MGMT promoter',
                      'MLH1',
                      'MSH2',
                      'MSH6',
                      'MYCN',
                      'PD-L1',
                      'PMS2',
                      'Progesterone receptor',
                      'PTEN',
                      'SMAD4'
                      ],
                  },
                },
                assessment_type: {
                  type: `keyword`,
                  [EXTENSIONS_KEY]: {
                    [FAKER_KEY]: ['IHC','CISH','FISH','Pyrosequencing/methylation-specific PCR'],
                },
                expression_level: {
                  type: `keyword`,
                  [EXTENSIONS_KEY]: {
                    [FAKER_KEY]: ['Positive','Negative','Equivocal'],
                }
              }
          }
        }
      }
    }
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
