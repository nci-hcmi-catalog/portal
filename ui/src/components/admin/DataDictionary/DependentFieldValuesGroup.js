import React, { useState } from 'react';

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

const DependentFieldValuesGroup = ({
  expanded,
  fieldName,
  fieldKey,
  fieldValues,
  toggleHandler,
}) => {
  const { addDependentField, editDependentField, removeDependentField } = useDictionary();
  const [newFieldValue, setNewFieldValue] = useState('');

  const addField = (e, fieldName, fieldType) => {
    e.preventDefault();

    addDependentField(fieldName.trim(), fieldType);

    setNewFieldValue('');
  };

  const editField = (originalValue, updatedValue, fieldType) => {
    editDependentField(originalValue, updatedValue, fieldType);
  };

  const removeField = (fieldName, fieldType) => {
    removeDependentField(fieldName, fieldType);
  };

  return (
    <>
      <DependentFieldType onClick={toggleHandler}>
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
            <AddFieldForm onSubmit={e => addField(e, newFieldValue, fieldKey)}>
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
              <AddFieldButton disabled={!newFieldValue.trim()}>
                <AdminDictionaryAddIcon width={12} height={12} />
                ADD
              </AddFieldButton>
            </AddFieldForm>
          </Row>
          {fieldValues && (
            <FieldValueList>
              {fieldValues.map(x => (
                <EditableFieldValue
                  key={x._id}
                  initialValue={x.value}
                  initialState={x.status}
                  original={x.original}
                  editFn={updatedValue => editField(x.value, updatedValue, fieldKey)}
                  removeFn={() => removeField(x.value, fieldKey)}
                  resetFn={() => editField(x.original, x.original, fieldKey)}
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
