import React, { useEffect, useState } from 'react';

import { useDictionary } from './DictionaryController';
import EditableFieldValue from './EditableFieldValue';

import AdminDictionaryAddIcon from '../../../icons/AdminDictionaryAddIcon';
import AdminDictionaryArrowIcon from '../../../icons/AdminDictionaryArrowIcon';

import {
  AddFieldForm,
  AddFieldInput,
  AddFieldButton,
  FieldValueList,
  DependentFieldType,
} from 'theme/adminDictionaryStyles';
import { Row } from 'theme/system';

const DependentFieldValuesGroup = ({ fieldName, fieldKey, fieldValues, isOpen = false }) => {
  const { addDependentField, removeDependentField } = useDictionary();
  const [expanded, setExpanded] = useState(isOpen);
  const [newFieldValue, setNewFieldValue] = useState('');

  const addField = (e, fieldName, fieldType) => {
    e.preventDefault();

    addDependentField(fieldName, fieldType);

    setNewFieldValue('');
  };

  const removeField = (fieldName, fieldType) => {
    removeDependentField(fieldName, fieldType);
  };

  useEffect(() => {
    setExpanded(isOpen);
  }, [isOpen]);

  return (
    <>
      <DependentFieldType onClick={() => setExpanded(!expanded)}>
        <AdminDictionaryArrowIcon
          height={12}
          width={12}
          css={expanded && 'transform: rotate(90deg);'}
        />
        {fieldName} ({(fieldValues || []).length})
      </DependentFieldType>
      {expanded && (
        <>
          <Row>
            <AddFieldForm onSubmit={e => addField(e, fieldKey, newFieldValue)}>
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
          {fieldValues && (
            <FieldValueList>
              {fieldValues.map(x => (
                <EditableFieldValue
                  key={x.value || x}
                  initialValue={x.value || x}
                  initialState={x.initialState}
                  removeFn={() => removeField(x.value, fieldKey)}
                />
              ))}
            </FieldValueList>
          )}
        </>
      )}
    </>
  );
};

export default DependentFieldValuesGroup;