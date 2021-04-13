/*
 * MOCK DATA FOR TESTING GDC GRAPHQL REQUESTS
 * ---
 * Since there are currently no known models which
 * return a response that satisfies the `noMafs`
 * and `noNgcm` cases, mock data was created.
 *
 * For completeness, the actual responses for
 * examples from the remaining cases are included
 * here as well.
 */

// example: HCM-BROD-0029-C71
const modelNotFound = {
  data: {
    data: {
      repository: {
        cases: {
          hits: {
            edges: [],
            total: 0,
          },
        },
        files: {
          hits: {
            edges: [],
            total: 0,
          },
        },
      },
    },
  },
};

// no known example of this
const noMafs = {
  data: {
    data: {
      repository: {
        cases: {
          hits: {
            edges: [
              {
                node: {
                  case_id: 'no-mafs-case',
                  samples: {
                    hits: {
                      edges: [
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id: 'blood-derived-normal-sample',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 1,
                              },
                            },
                            sample_type: 'Blood Derived Normal',
                            tissue_type: 'Normal',
                          },
                        },
                      ],
                      total: 1,
                    },
                  },
                },
              },
            ],
            total: 1,
          },
        },
        files: {
          hits: {
            edges: [
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: 'blood-derived-normal-sample',
                          },
                        },
                      ],
                    },
                  },
                  file_id: 'file-with-no-cancer-model-mafs',
                  file_name: 'file-with-no-cancer-model-mafs.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
            ],
            total: 1,
          },
        },
      },
    },
  },
};

// example: HCM-BROD-0332-C43
const singleNgcm = {
  data: {
    data: {
      repository: {
        cases: {
          hits: {
            edges: [
              {
                node: {
                  case_id: 'f0c1dd21-a156-4284-afda-985cd2656a9f',
                  samples: {
                    hits: {
                      edges: [
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '5e047d9d-4d87-409b-a52f-83fa7e5c7d6a',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 1,
                              },
                            },
                            sample_type: 'Blood Derived Normal',
                            tissue_type: 'Normal',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'daca03b5-7eaa-4b13-b518-4f1bf622c261',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '12a28c4d-8785-473b-92a1-45ef4b110f3e',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 2,
                              },
                            },
                            sample_type: 'Next Generation Cancer Model',
                            tissue_type: 'Tumor',
                          },
                        },
                      ],
                      total: 2,
                    },
                  },
                },
              },
            ],
            total: 1,
          },
        },
        files: {
          hits: {
            edges: [
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: '5e047d9d-4d87-409b-a52f-83fa7e5c7d6a',
                          },
                        },
                        {
                          node: {
                            entity_id: '12a28c4d-8785-473b-92a1-45ef4b110f3e',
                          },
                        },
                      ],
                    },
                  },
                  file_id: 'a55feadc-df35-4087-9d04-c5d33b9a8aa9',
                  file_name:
                    '34d4549f-2823-4e4f-b4b8-5bfa96cef01e.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
            ],
            total: 1,
          },
        },
      },
    },
  },
};

// example: HCM-BROD-0002-C71
const singleNgcmPlusEngcm = {
  data: {
    data: {
      repository: {
        cases: {
          hits: {
            edges: [
              {
                node: {
                  case_id: '3092d72b-75b1-4ae2-ac38-d4c1cd377e4c',
                  samples: {
                    hits: {
                      edges: [
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'fa5d311d-200f-420f-8f2a-01800d1f87c3',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '1521b9d7-8172-46ed-8cdb-a18418033392',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 2,
                              },
                            },
                            sample_type: 'Next Generation Cancer Model',
                            tissue_type: 'Tumor',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '834a7b34-3e2a-4394-a9fd-4f0c4b8c12c0',
                                                        },
                                                      },
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'c2bbd3a5-486d-41d5-afec-e7de39b7a35a',
                                                        },
                                                      },
                                                    ],
                                                    total: 2,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 1,
                              },
                            },
                            sample_type: 'Blood Derived Normal',
                            tissue_type: 'Normal',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '92973230-906f-45e7-be10-22cc24d61de8',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'cb22894a-1e7a-40df-ac46-51beaa248cb8',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 2,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 1,
                              },
                            },
                            sample_type: 'Primary Tumor',
                            tissue_type: 'Tumor',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '42ae1a91-f226-43e2-8abb-8f29c086940c',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'ebe84640-6535-43f0-8607-0c32770ec2a6',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 2,
                              },
                            },
                            sample_type: 'Expanded Next Generation Cancer Model',
                            tissue_type: 'Tumor',
                          },
                        },
                      ],
                      total: 4,
                    },
                  },
                },
              },
            ],
            total: 1,
          },
        },
        files: {
          hits: {
            edges: [
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: 'c2bbd3a5-486d-41d5-afec-e7de39b7a35a',
                          },
                        },
                        {
                          node: {
                            entity_id: '92973230-906f-45e7-be10-22cc24d61de8',
                          },
                        },
                      ],
                    },
                  },
                  file_id: 'f6f7e5ec-bc34-4fd8-970d-1c5e5de89e0d',
                  file_name:
                    '869040db-e22d-473f-9232-9b03a5dbdfb6.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: 'ebe84640-6535-43f0-8607-0c32770ec2a6',
                          },
                        },
                        {
                          node: {
                            entity_id: 'c2bbd3a5-486d-41d5-afec-e7de39b7a35a',
                          },
                        },
                      ],
                    },
                  },
                  file_id: '53915f0a-c3a5-46b0-a5d4-92b39633b3ed',
                  file_name:
                    'f4a5ef98-96e3-4018-8192-175d7499c9c8.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: '1521b9d7-8172-46ed-8cdb-a18418033392',
                          },
                        },
                        {
                          node: {
                            entity_id: 'c2bbd3a5-486d-41d5-afec-e7de39b7a35a',
                          },
                        },
                      ],
                    },
                  },
                  file_id: '2c554435-0a28-411e-bc70-733525e75441',
                  file_name:
                    '2c219a3a-5a42-4e24-8106-2d1be9f1e20e.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
            ],
            total: 3,
          },
        },
      },
    },
  }
};

// example: HCM-CSHL-0434-C24
const multipleNgcm = {
  data: {
    data: {
      repository: {
        cases: {
          hits: {
            edges: [
              {
                node: {
                  case_id: 'c4025241-d423-4daa-b0fc-b27873d4e314',
                  samples: {
                    hits: {
                      edges: [
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '5dda74a2-e5e0-4926-b55c-59c99fdfedf5',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '734b5cab-815e-4ff1-a6c8-c0ccdf7b224f',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 2,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 1,
                              },
                            },
                            sample_type: 'Metastatic',
                            tissue_type: 'Tumor',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '5ec56ae9-f2ec-4ea2-b116-819d2405dbbf',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'a76c852e-e254-4ba5-a899-e2a90b83cc1a',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 2,
                              },
                            },
                            sample_type: 'Next Generation Cancer Model',
                            tissue_type: 'Tumor',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '4ff990f4-daea-45d6-b271-8ab4801ddaf5',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 1,
                              },
                            },
                            sample_type: 'Blood Derived Normal',
                            tissue_type: 'Normal',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '2d18d873-6900-4948-b85e-d311619fd1f6',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'f4cd062d-4fd6-44b0-9bce-37e648dbedb4',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 2,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 1,
                              },
                            },
                            sample_type: 'Primary Tumor',
                            tissue_type: 'Tumor',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '6d535c7a-f9cd-4523-830d-1c9b3427d580',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'be55b8d0-bf77-4378-b6d9-655d0346fbc0',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 2,
                              },
                            },
                            sample_type: 'Next Generation Cancer Model',
                            tissue_type: 'Tumor',
                          },
                        },
                      ],
                      total: 5,
                    },
                  },
                },
              },
            ],
            total: 1,
          },
        },
        files: {
          hits: {
            edges: [
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: '4ff990f4-daea-45d6-b271-8ab4801ddaf5',
                          },
                        },
                        {
                          node: {
                            entity_id: 'f4cd062d-4fd6-44b0-9bce-37e648dbedb4',
                          },
                        },
                      ],
                    },
                  },
                  file_id: '6c9f02c9-2052-4d24-98b1-014cb003f3ec',
                  file_name:
                    'd024b01a-9310-4e86-9db7-249a4fa70d59.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: '6d535c7a-f9cd-4523-830d-1c9b3427d580',
                          },
                        },
                        {
                          node: {
                            entity_id: '4ff990f4-daea-45d6-b271-8ab4801ddaf5',
                          },
                        },
                      ],
                    },
                  },
                  file_id: 'e5feff3e-905c-4422-bbfa-f618b329a9af',
                  file_name:
                    '1106321b-fb57-4d48-940b-7638b8dbecbe.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: '4ff990f4-daea-45d6-b271-8ab4801ddaf5',
                          },
                        },
                        {
                          node: {
                            entity_id: '734b5cab-815e-4ff1-a6c8-c0ccdf7b224f',
                          },
                        },
                      ],
                    },
                  },
                  file_id: '5b932920-8b0b-40da-85e0-c079230a8b76',
                  file_name:
                    'e28a2dc8-bbcd-4fad-9915-2c5dd6b0d535.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: '4ff990f4-daea-45d6-b271-8ab4801ddaf5',
                          },
                        },
                        {
                          node: {
                            entity_id: 'a76c852e-e254-4ba5-a899-e2a90b83cc1a',
                          },
                        },
                      ],
                    },
                  },
                  file_id: '7e5392a8-e921-4748-a464-553b7525258e',
                  file_name:
                    'df2d1fad-7f82-4e00-8e62-6cf811dc1466.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
            ],
            total: 4,
          },
        },
      },
    },
  },
};

// no known example of this
const noNgcm = {
  data: {
    data: {
      repository: {
        cases: {
          hits: {
            edges: [
              {
                node: {
                  case_id: 'no-ngm-case',
                  samples: {
                    hits: {
                      edges: [
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'fa5d311d-200f-420f-8f2a-01800d1f87c3',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '1521b9d7-8172-46ed-8cdb-a18418033392',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 2,
                              },
                            },
                            sample_type: 'Expanded Next Generation Cancer Model',
                            tissue_type: 'Tumor',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '834a7b34-3e2a-4394-a9fd-4f0c4b8c12c0',
                                                        },
                                                      },
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'c2bbd3a5-486d-41d5-afec-e7de39b7a35a',
                                                        },
                                                      },
                                                    ],
                                                    total: 2,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 1,
                              },
                            },
                            sample_type: 'Blood Derived Normal',
                            tissue_type: 'Normal',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '92973230-906f-45e7-be10-22cc24d61de8',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'cb22894a-1e7a-40df-ac46-51beaa248cb8',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 2,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 1,
                              },
                            },
                            sample_type: 'Primary Tumor',
                            tissue_type: 'Tumor',
                          },
                        },
                        {
                          node: {
                            portions: {
                              hits: {
                                edges: [
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            '42ae1a91-f226-43e2-8abb-8f29c086940c',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                  {
                                    node: {
                                      analytes: {
                                        hits: {
                                          edges: [
                                            {
                                              node: {
                                                aliquots: {
                                                  hits: {
                                                    edges: [
                                                      {
                                                        node: {
                                                          aliquot_id:
                                                            'ebe84640-6535-43f0-8607-0c32770ec2a6',
                                                        },
                                                      },
                                                    ],
                                                    total: 1,
                                                  },
                                                },
                                              },
                                            },
                                          ],
                                          total: 1,
                                        },
                                      },
                                    },
                                  },
                                ],
                                total: 2,
                              },
                            },
                            sample_type: 'Expanded Next Generation Cancer Model',
                            tissue_type: 'Tumor',
                          },
                        },
                      ],
                      total: 4,
                    },
                  },
                },
              },
            ],
            total: 1,
          },
        },
        files: {
          hits: {
            edges: [
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: 'c2bbd3a5-486d-41d5-afec-e7de39b7a35a',
                          },
                        },
                        {
                          node: {
                            entity_id: '92973230-906f-45e7-be10-22cc24d61de8',
                          },
                        },
                      ],
                    },
                  },
                  file_id: 'f6f7e5ec-bc34-4fd8-970d-1c5e5de89e0d',
                  file_name:
                    '869040db-e22d-473f-9232-9b03a5dbdfb6.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: 'ebe84640-6535-43f0-8607-0c32770ec2a6',
                          },
                        },
                        {
                          node: {
                            entity_id: 'c2bbd3a5-486d-41d5-afec-e7de39b7a35a',
                          },
                        },
                      ],
                    },
                  },
                  file_id: '53915f0a-c3a5-46b0-a5d4-92b39633b3ed',
                  file_name:
                    'f4a5ef98-96e3-4018-8192-175d7499c9c8.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
              {
                node: {
                  associated_entities: {
                    hits: {
                      edges: [
                        {
                          node: {
                            entity_id: '1521b9d7-8172-46ed-8cdb-a18418033392',
                          },
                        },
                        {
                          node: {
                            entity_id: 'c2bbd3a5-486d-41d5-afec-e7de39b7a35a',
                          },
                        },
                      ],
                    },
                  },
                  file_id: '2c554435-0a28-411e-bc70-733525e75441',
                  file_name:
                    '2c219a3a-5a42-4e24-8106-2d1be9f1e20e.wxs.aliquot_ensemble_masked.maf.gz',
                },
              },
            ],
            total: 3,
          },
        },
      },
    },
  },
};

const MOCK_GDC_DATA = {
  modelNotFound,
  noMafs,
  singleNgcm,
  singleNgcmPlusEngcm,
  multipleNgcm,
  noNgcm,
};

export default MOCK_GDC_DATA;
