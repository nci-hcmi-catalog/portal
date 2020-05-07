// TODO: delete this dummy data after integrating with the API
const dictionaryData = {
  fields: [
    {
      name: 'primarySites',
      displayName: 'Primary Sites',
      dependentValues: [],
      values: [
        {
          value: 'Abdomen',
          dependents: [],
        },
        {
          value: 'Back',
          dependents: [],
        },
        {
          value: 'Calcaneus',
          dependents: [],
        },
        {
          value: 'Diaphragm',
          dependents: [],
        },
        {
          value: 'Ear',
          dependents: [],
        },
        {
          value: 'Foot',
          dependents: [],
        },
        {
          value: 'Wrist',
          dependents: [],
        },
      ],
    },
    {
      name: 'modelType',
      displayName: 'Model Type',
      dependentValues: [],
      values: [
        {
          value: '3-D: Organoid',
          dependents: [],
        },
        {
          value: '3-D: Other (e.g. neurosphere, air-liquid interface, etc.)',
          dependents: [],
        },
        {
          value: '2-D: Conditionally reprogrammed cells',
          dependents: [],
        },
        {
          value: '2-D: Adherent',
          dependents: [],
        },
        {
          value: '2-D: Suspension',
          dependents: [],
        },
        {
          value: 'Mixed adherent and suspension',
          dependents: [],
        },
        {
          value: 'Other',
          dependents: [],
        },
      ],
    },
    {
      name: 'clinicalTumorDiagnosis',
      displayName: 'Clinical Tumor Diagnosis',
      dependentValues: [
        'histological type',
        'clinical stage grouping',
        'site of sample acquisition',
        'tumor histological grade'
      ],
      values: [
        {
          value: 'Ampulla of Vater',
          dependents: [
            {
              name: 'histological type',
              displayName: 'Histological Type',
              dependentValues: [],
              values: [
                {
                  value: 'Adenocarcinoma',
                  dependents: [],
                },
                {
                  value: 'Adenocarcinoma with peculiar aspects',
                  dependents: [],
                },
                {
                  value: 'Hepatoid carcinoma',
                  dependents: [],
                },
                {
                  value: 'Medullary carcinoma',
                  dependents: [],
                },
                {
                  value: 'Mixed adenoneuroendocrine carcinoma',
                  dependents: [],
                },
                {
                  value: 'Moderately-differentiated neuroendocrine carcinoma',
                  dependents: [],
                },
                {
                  value: 'Neuroendocrine carcinoma, large cell',
                  dependents: [],
                },
                {
                  value: 'Neuroendocrine carcinoma, small cell',
                  dependents: [],
                },
                {
                  value: 'Undifferentiated carcinoma',
                  dependents: [],
                },
                {
                  value: 'Well-differentiated neuroendocrine carcinoma',
                  dependents: [],
                },
              ],
            },
            {
              name: 'clinical stage grouping',
              displayName: 'Clinical Stage Grouping',
              dependentValues: [],
              values: [
                {
                  value: '0',
                  dependents: [],
                },
                {
                  value: 'IA',
                  dependents: [],
                },
                {
                  value: 'IB',
                  dependents: [],
                },
                {
                  value: 'IIA',
                  dependents: [],
                },
                {
                  value: 'IIB',
                  dependents: [],
                },
                {
                  value: 'IIIA',
                  dependents: [],
                },
                {
                  value: 'IIIB',
                  dependents: [],
                },
                {
                  value: 'IV',
                  dependents: [],
                },
              ],
            },
            {
              name: 'site of sample acquisition',
              displayName: 'Site Of Sample Acquisition',
              dependentValues: [],
              values: [
                {
                  value: 'Ampulla of Vater',
                  dependents: [],
                },
                {
                  value: 'Bone',
                  dependents: [],
                },
                {
                  value: 'Brain',
                  dependents: [],
                },
                {
                  value: 'Kidney',
                  dependents: [],
                },
                {
                  value: 'Liver',
                  dependents: [],
                },
                {
                  value: 'Lung',
                  dependents: [],
                },
                {
                  value: 'Lymph node',
                  dependents: [],
                },
                {
                  value: 'Peritoneum',
                  dependents: [],
                },
                {
                  value: 'Other',
                  dependents: [],
                },
              ],
            },
            {
              name: 'tumor histological grade',
              displayName: 'Tumor Histological Grade',
              dependentValues: [],
              values: [
                {
                  value: 'G1',
                  dependents: [],
                },
                {
                  value: 'G2',
                  dependents: [],
                },
                {
                  value: 'G3',
                  dependents: [],
                },
                {
                  value: 'GX',
                  dependents: [],
                },
                {
                  value: 'GB',
                  dependents: [],
                },
              ],
            },
          ],
        },
        {
          value: 'Rare cancers',
          dependents: [
            {
              name: 'histological type',
              displayName: 'Histological Type',
              dependentValues: [],
              values: [
                {
                  value: 'Adenocarcinoma',
                  dependents: [],
                },
                {
                  value: 'Chordoma',
                  dependents: [],
                },
                {
                  value: 'Duodenal gastrinoma',
                  dependents: [],
                },
                {
                  value: 'Epithelial sarcoma',
                  dependents: [],
                },
                {
                  value: 'Epithelioid sarcoma',
                  dependents: [],
                },
                {
                  value: 'Extrahepatic cholangiocarcinoma',
                  dependents: [],
                },
                {
                  value: 'Intraductal papillary neoplasm',
                  dependents: [],
                },
                {
                  value: 'Malignant spindle cell neoplasm',
                  dependents: [],
                },
                {
                  value: 'Small intestine cancer',
                  dependents: [],
                },
                {
                  value: 'Spindle cell sarcoma',
                  dependents: [],
                },
                {
                  value: 'Tubulovillous adenoma',
                  dependents: [],
                },
              ],
            },
            {
              name: 'clinical stage grouping',
              displayName: 'Clinical Stage Grouping',
              dependentValues: [],
              values: [
                {
                  value: 'Stage 0',
                  dependents: [],
                },
                {
                  value: 'Stage I',
                  dependents: [],
                },
                {
                  value: 'Stage II',
                  dependents: [],
                },
                {
                  value: 'Stage III',
                  dependents: [],
                },
                {
                  value: 'Stage IV',
                  dependents: [],
                },
              ],
            },
            {
              name: 'site of sample acquisition',
              displayName: 'Site Of Sample Acquisition',
              dependentValues: [],
              values: [
                {
                  value: 'Brain',
                  dependents: [],
                },
                {
                  value: 'Pleural cavity',
                  dependents: [],
                },
                {
                  value: 'Rectosigmoid junction',
                  dependents: [],
                },
                {
                  value: 'Gallbladder',
                  dependents: [],
                },
                {
                  value: 'Cecum',
                  dependents: [],
                },
                {
                  value: 'Ascending colon',
                  dependents: [],
                },
                {
                  value: 'Extrahepatic bile duct',
                  dependents: [],
                },
                {
                  value: 'Lymph node(s)',
                  dependents: [],
                },
                {
                  value: 'Transverse colon',
                  dependents: [],
                },
                {
                  value: 'Sigmoid colon',
                  dependents: [],
                },
                {
                  value: 'Ileum',
                  dependents: [],
                },
              ],
            },
            {
              name: 'tumor histological grade',
              displayName: 'Tumor Histological Grade',
              dependentValues: [],
              values: [
                {
                  value: 'GX',
                  dependents: [],
                },
                {
                  value: 'G1',
                  dependents: [],
                },
                {
                  value: 'G2',
                  dependents: [],
                },
                {
                  value: 'G3',
                  dependents: [],
                },
                {
                  value: 'G4',
                  dependents: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default dictionaryData;
