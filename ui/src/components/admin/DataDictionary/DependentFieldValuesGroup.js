import React, { useState } from 'react';
import { css } from '@emotion/react';

import { useDictionary } from './DictionaryController';
import EditableFieldValue from './EditableFieldValue';

import PlusIcon from '../../../icons/PlusIcon';
import ArrowIcon from '../../../icons/ArrowIcon';

import {
  AddFieldForm,
  AddFieldInput,
  FieldValueList,
  DependentFieldType,
} from 'theme/adminDictionaryStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { Row } from 'theme/system';

const DependentFieldValuesGroup = ({
  expanded,
  fieldName,
  fieldKey,
  fieldValues,
  toggleHandler,
}) => {
  const { addField, editField, removeField } = useDictionary();
  const [newFieldValue, setNewFieldValue] = useState('');

  const add = (e, fieldName, fieldType) => {
    e.preventDefault();

    addField(fieldName.trim(), fieldType);

    setNewFieldValue('');
  };

  const edit = (originalValue, updatedValue, fieldType) => {
    return editField(originalValue, updatedValue, fieldType);
  };

  const remove = (fieldName, fieldType) => {
    removeField(fieldName, fieldType);
  };

  return (
    <>
      <DependentFieldType onClick={toggleHandler}>
        <ArrowIcon
          css={
            expanded &&
            css`
              transform: rotate(90deg);
            `
          }
        />
        {fieldName} ({(fieldValues || []).length})
      </DependentFieldType>
      {expanded && (
        <>
          <Row>
            <AddFieldForm onSubmit={(e) => add(e, newFieldValue, fieldKey)}>
              <AddFieldInput
                type="text"
                id="new-dependent-field"
                name="new-dependent-field"
                placeholder="Add a new value..."
                aria-label="Add a new value..."
                value={newFieldValue}
                onChange={(e) => {
                  e.preventDefault();
                  setNewFieldValue(e.target.value);
                }}
              />
              <ButtonPill primary disabled={!newFieldValue.trim()}>
                <PlusIcon />
                ADD
              </ButtonPill>
            </AddFieldForm>
          </Row>
          {fieldValues && (
            <FieldValueList>
              {fieldValues.map((x) => (
                <EditableFieldValue
                  key={x._id}
                  initialValue={x.value}
                  initialState={x.status}
                  original={x.original}
                  editFn={(updatedValue) => edit(x.original || x.value, updatedValue, fieldKey)}
                  removeFn={() => remove(x.value, fieldKey)}
                  resetFn={() => edit(x.original, x.original, fieldKey)}
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
