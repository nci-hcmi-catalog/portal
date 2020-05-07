import React, { useState } from 'react';

import { useDictionary } from './DictionaryController';
import EditableFieldValue from './EditableFieldValue';

import {
  AddFieldForm,
  AddFieldInput,
  AddFieldButton,
  FieldValues,
  FieldValueList,
  DictionaryColumnHeading,
} from 'theme/adminDictionaryStyles';
import { Row } from 'theme/system';

import AdminDictionaryAddIcon from '../../../icons/AdminDictionaryAddIcon';

const DictionaryFieldValues = () => {
  const {
    activeField,
    activeFieldValues,
    activeValue,
    addField,
    removeField,
    setActiveValue,
  } = useDictionary();
  const [newFieldValue, setNewFieldValue] = useState('');

  const addNewField = e => {
    e.preventDefault();

    addField(newFieldValue);

    setNewFieldValue('');
  };

  const removeNewField = value => {
    removeField(value);
  };

  return (
    <FieldValues selected={activeValue}>
      {activeField && (
        <>
          <DictionaryColumnHeading>{activeField} Values</DictionaryColumnHeading>
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
            {activeFieldValues &&
              activeFieldValues.length > 0 &&
              activeFieldValues.map(fieldValue => (
                <EditableFieldValue
                  key={fieldValue.value}
                  initialValue={fieldValue.value}
                  initialState={fieldValue.status}
                  active={activeValue === fieldValue.value}
                  onClick={() => {
                    setActiveValue(fieldValue.value, fieldValue.dependents);
                  }}
                  removeFn={() => removeNewField(fieldValue.value)}
                />
              ))}
          </FieldValueList>
        </>
      )}
    </FieldValues>
  );
};

export default DictionaryFieldValues;
