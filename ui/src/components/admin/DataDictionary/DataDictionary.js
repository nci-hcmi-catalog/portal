import React, { useState } from 'react';

import EditableFieldValue from './EditableFieldValue';
import { AdminContainer, AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { NotificationToaster } from '../Notifications';

import AdminModelPublishIcon from '../../../icons/AdminModelPublishIcon';
import AdminDictionarySaveIcon from '../../../icons/AdminDictionarySaveIcon';
import AdminDictionaryAddIcon from '../../../icons/AdminDictionaryAddIcon';

import TabGroup from 'components/layout/VerticalTabs';
import Tab from 'components/layout/VerticalTabs/Tab';
import { HoverPill } from 'theme/adminControlsStyles';
import {
  AdminDictionaryContent,
  AddFieldForm,
  AddFieldInput,
  AddFieldButton,
  FieldValues,
  FieldValueList,
  DataDictionaryH1,
  DependentValues,
  DependentValuesHeader,
  DictionaryColumnHeading,
  actionPill,
  cancelPill,
  disabledPill,
  expandPill,
} from 'theme/adminDictionaryStyles';
import { Row } from 'theme/system';

const DEPENDENT_FIELD_KEYS = {
  histologicalType: 'histological type',
  clinicalStageGrouping: 'clinical stage grouping',
  siteOfSampleAcquisition: 'site of sample acquisition',
  tumorHistologicalGrade: 'tumor histological grade',
};

// temporary hard-coded field values, will be replaced by API data
const fieldValuesList = [
  {
    value: '2-D: Conditionally reprogrammed cells',
    dependents: {
      'histological type': [
        'Adenocarcinoma',
        'Adenocarcinoma with peculiar aspects',
        'Hepatoid carcinoma',
        'Medullary carcinoma',
        'Mixed adenoneuroendocrine carcinoma',
        'Moderately-differentiated neuroendocrine carcinoma',
        'Neuroendocrine carcinoma, large cell',
        'Neuroendocrine carcinoma, small cell',
        'Undifferentiated carcinoma',
        'Well-differentiated neuroendocrine carcinoma',
      ],
      'clinical stage grouping': ['0', 'IA', 'IB', 'IIA', 'IIB', 'IIIA', 'IIIB', 'IV'],
      'site of sample acquisition': [
        'Ampulla of Vater',
        'Bone',
        'Brain',
        'Kidney',
        'Liver',
        'Lung',
        'Lymph node',
        'Peritoneum',
        'Other',
      ],
      'tumor histological grade': ['G1', 'G2', 'G3', 'GX', 'GB'],
    },
  },
  {
    value: '2-D: Other (e.g. neurosphere, air-liquid interface, etc.)',
  },
  {
    value: '2-D: Suspension',
  },
  {
    value: '2-D: Vertically Adherent',
  },
  {
    value: '3-D: Organoid',
  },
];

// temporary toggle for header buttons, set to false to see active states
const disableHeaderButtons = true;

const mainTabWidth = 280;

const DataDictionary = () => {
  const groupName = 'Editable Fields';

  // temporary use of state, will be using context for this eventually
  const [activeTab, setActiveTab] = useState('tab-0');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [newHistologicalSubtypeValue, setNewHistologicalSubtypeValue] = useState('');
  const [newClinicalStageValue, setNewClinicalStageValue] = useState('');
  const [newGradeValue, setNewGradeValue] = useState('');
  const [newAcquisitionSiteValue, setNewAcquisitionSiteValue] = useState('');
  const [fieldValues, setFieldValues] = useState(fieldValuesList);
  const [selectedField, setSelectedField] = useState('');
  const [selectedDependents, setSelectedDependents] = useState({});

  const addNewField = e => {
    e.preventDefault();

    setFieldValues(
      [
        ...fieldValues,
        {
          value: newFieldValue,
          initialState: 'new',
        },
      ].sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
      }),
    );

    setNewFieldValue('');
  };

  const addNewDependentField = (e, fieldType) => {
    e.preventDefault();

    switch (fieldType) {
      case DEPENDENT_FIELD_KEYS.histologicalType:
        setSelectedDependents({
          ...(selectedDependents || {}),
          [DEPENDENT_FIELD_KEYS.histologicalType]: [
            ...(selectedDependents[DEPENDENT_FIELD_KEYS.histologicalType] || []),
            newHistologicalSubtypeValue,
          ],
        });
        setNewHistologicalSubtypeValue('');
        break;
      case DEPENDENT_FIELD_KEYS.clinicalStageGrouping:
        setSelectedDependents({
          ...(selectedDependents || {}),
          [DEPENDENT_FIELD_KEYS.clinicalStageGrouping]: [
            ...(selectedDependents[DEPENDENT_FIELD_KEYS.clinicalStageGrouping] || []),
            newClinicalStageValue,
          ],
        });
        setNewClinicalStageValue('');
        break;
      case DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition:
        setSelectedDependents({
          ...(selectedDependents || {}),
          [DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition]: [
            ...(selectedDependents[DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition] || []),
            newAcquisitionSiteValue,
          ],
        });
        setNewAcquisitionSiteValue('');
        break;
      case DEPENDENT_FIELD_KEYS.tumorHistologicalGrade:
        setSelectedDependents({
          ...(selectedDependents || {}),
          [DEPENDENT_FIELD_KEYS.tumorHistologicalGrade]: [
            ...(selectedDependents[DEPENDENT_FIELD_KEYS.tumorHistologicalGrade] || []),
            newGradeValue,
          ],
        });
        setNewGradeValue('');
        break;
      default:
        break;
    }
  };

  const removeNewField = value => {
    setFieldValues(fieldValues.filter(fieldValue => fieldValue.value !== value));
  };

  return (
    <AdminContainer>
      <NotificationToaster />
      <AdminHeader>
        <DataDictionaryH1>Data Dictionary</DataDictionaryH1>
        <AdminHeaderBlock>
          <HoverPill
            primary
            disabled={disableHeaderButtons}
            marginRight="10px"
            css={disableHeaderButtons ? disabledPill : cancelPill}
            onClick={() => console.log('Data Dictionary: Cancel')}
          >
            Cancel
          </HoverPill>
          <HoverPill
            primary
            disabled={disableHeaderButtons}
            marginRight="10px"
            css={disableHeaderButtons ? disabledPill : actionPill}
            onClick={() => console.log('Data Dictionary: Publish All Updates')}
          >
            <AdminModelPublishIcon width={16} height={16} css={'margin-right: 9px;'} />
            Publish All Updates
          </HoverPill>
          <HoverPill
            primary
            disabled={disableHeaderButtons}
            marginRight="10px"
            css={disableHeaderButtons ? disabledPill : actionPill}
            onClick={() => console.log('Data Dictionary: Save Draft')}
          >
            <AdminDictionarySaveIcon
              width={16}
              height={16}
              fill={'#ffffff'}
              css={'margin-right: 9px;'}
            />
            Save Draft
          </HoverPill>
        </AdminHeaderBlock>
      </AdminHeader>
      <Row>
        <TabGroup groupName={groupName} width={mainTabWidth}>
          <Tab
            heading="Active"
            subheading="Can set a tab to be active initially"
            active={activeTab === 'tab-0'}
            onClick={() => setActiveTab('tab-0')}
          />
          <Tab
            heading="Default Style"
            subheading="With subheading"
            active={activeTab === 'tab-1'}
            onClick={() => setActiveTab('tab-1')}
          />
          <Tab
            heading="Has Dot"
            subheading="With status indicator"
            dot={true}
            active={activeTab === 'tab-2'}
            onClick={() => setActiveTab('tab-2')}
          />
          <Tab
            heading="No Subheading"
            active={activeTab === 'tab-3'}
            onClick={() => setActiveTab('tab-3')}
          />
          <Tab
            heading="Disabled"
            subheading="No click, no hover, no problem"
            disabled={true}
            active={activeTab === 'tab-4'}
          />
        </TabGroup>
        <AdminDictionaryContent tabWidth={mainTabWidth}>
          <FieldValues selected={selectedField}>
            <DictionaryColumnHeading>Field Values</DictionaryColumnHeading>
            <Row>
              <AddFieldForm onSubmit={addNewField}>
                <AddFieldInput
                  type="text"
                  id="new-field"
                  name="new-field"
                  placeholder="Add a new value..."
                  value={newFieldValue}
                  onChange={e => {
                    e.preventDefault();
                    setNewFieldValue(e.target.value);
                  }}
                />
                <AddFieldButton disabled={!newFieldValue}>
                  <AdminDictionaryAddIcon width={12} height={12} />
                  ADD
                </AddFieldButton>
              </AddFieldForm>
            </Row>
            <FieldValueList>
              {fieldValues &&
                fieldValues.map(fieldValue => (
                  <EditableFieldValue
                    key={fieldValue.value}
                    initialValue={fieldValue.value}
                    initialState={fieldValue.initialState}
                    active={selectedField === fieldValue.value}
                    onClick={() => {
                      setSelectedField(fieldValue.value);
                      setSelectedDependents(fieldValue.dependents || {});
                    }}
                    removeFn={() => removeNewField(fieldValue.value)}
                  />
                ))}
            </FieldValueList>
          </FieldValues>
          {selectedField !== '' ? (
            <DependentValues>
              <DependentValuesHeader>
                <DictionaryColumnHeading>Dependent Field Values</DictionaryColumnHeading>
                <HoverPill
                  primary
                  css={expandPill}
                  onClick={() => console.log('Data Dictionary: Expand All Dependent Fields')}
                >
                  Expand All
                </HoverPill>
              </DependentValuesHeader>
              <h3>Histological Subtype</h3>
              <Row>
                <AddFieldForm
                  onSubmit={e => addNewDependentField(e, DEPENDENT_FIELD_KEYS.histologicalType)}
                >
                  <AddFieldInput
                    type="text"
                    id="new-field"
                    name="new-field"
                    placeholder="Add a new value..."
                    value={newHistologicalSubtypeValue}
                    onChange={e => {
                      e.preventDefault();
                      setNewHistologicalSubtypeValue(e.target.value);
                    }}
                  />
                  <AddFieldButton disabled={!newHistologicalSubtypeValue}>
                    <AdminDictionaryAddIcon width={12} height={12} />
                    ADD
                  </AddFieldButton>
                </AddFieldForm>
              </Row>
              {selectedDependents[DEPENDENT_FIELD_KEYS.histologicalType] && (
                <FieldValueList>
                  {selectedDependents[DEPENDENT_FIELD_KEYS.histologicalType].map(x => (
                    <EditableFieldValue key={x} initialValue={x} />
                  ))}
                </FieldValueList>
              )}
              <h3>Clinical Stage Grouping</h3>
              <Row>
                <AddFieldForm
                  onSubmit={e =>
                    addNewDependentField(e, DEPENDENT_FIELD_KEYS.clinicalStageGrouping)
                  }
                >
                  <AddFieldInput
                    type="text"
                    id="new-field"
                    name="new-field"
                    placeholder="Add a new value..."
                    value={newClinicalStageValue}
                    onChange={e => {
                      e.preventDefault();
                      setNewClinicalStageValue(e.target.value);
                    }}
                  />
                  <AddFieldButton disabled={!newClinicalStageValue}>
                    <AdminDictionaryAddIcon width={12} height={12} />
                    ADD
                  </AddFieldButton>
                </AddFieldForm>
              </Row>
              {selectedDependents[DEPENDENT_FIELD_KEYS.clinicalStageGrouping] && (
                <FieldValueList>
                  {selectedDependents[DEPENDENT_FIELD_KEYS.clinicalStageGrouping].map(x => (
                    <EditableFieldValue key={x} initialValue={x} />
                  ))}
                </FieldValueList>
              )}
              <h3>Histological Grade</h3>
              <Row>
                <AddFieldForm
                  onSubmit={e =>
                    addNewDependentField(e, DEPENDENT_FIELD_KEYS.tumorHistologicalGrade)
                  }
                >
                  <AddFieldInput
                    type="text"
                    id="new-field"
                    name="new-field"
                    placeholder="Add a new value..."
                    value={newGradeValue}
                    onChange={e => {
                      e.preventDefault();
                      setNewGradeValue(e.target.value);
                    }}
                  />
                  <AddFieldButton disabled={!newGradeValue}>
                    <AdminDictionaryAddIcon width={12} height={12} />
                    ADD
                  </AddFieldButton>
                </AddFieldForm>
              </Row>
              {selectedDependents[DEPENDENT_FIELD_KEYS.tumorHistologicalGrade] && (
                <FieldValueList>
                  {selectedDependents[DEPENDENT_FIELD_KEYS.tumorHistologicalGrade].map(x => (
                    <EditableFieldValue key={x} initialValue={x} />
                  ))}
                </FieldValueList>
              )}
              <h3>Acquisition Site</h3>
              <Row>
                <AddFieldForm
                  onSubmit={e =>
                    addNewDependentField(e, DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition)
                  }
                >
                  <AddFieldInput
                    type="text"
                    id="new-field"
                    name="new-field"
                    placeholder="Add a new value..."
                    value={newAcquisitionSiteValue}
                    onChange={e => {
                      e.preventDefault();
                      setNewAcquisitionSiteValue(e.target.value);
                    }}
                  />
                  <AddFieldButton disabled={!newAcquisitionSiteValue}>
                    <AdminDictionaryAddIcon width={12} height={12} />
                    ADD
                  </AddFieldButton>
                </AddFieldForm>
              </Row>
              {selectedDependents[DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition] && (
                <FieldValueList>
                  {selectedDependents[DEPENDENT_FIELD_KEYS.siteOfSampleAcquisition].map(x => (
                    <EditableFieldValue key={x} initialValue={x} />
                  ))}
                </FieldValueList>
              )}
            </DependentValues>
          ) : null}
        </AdminDictionaryContent>
      </Row>
    </AdminContainer>
  );
};

export default DataDictionary;
