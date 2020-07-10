import React, { useState } from 'react';

import { useDictionary } from './DictionaryController';
import EditableFieldValue from './EditableFieldValue';

import { CLINICAL_TUMOR_DIAGNOSIS } from './../helpers/dictionary';

import {
  AddFieldForm,
  AddFieldInput,
  FieldValues,
  FieldValueList,
  DictionaryColumnHeading,
} from 'theme/adminDictionaryStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { Row } from 'theme/system';

import PlusIcon from '../../../icons/PlusIcon';

const DictionaryFieldValues = () => {
  const {
    activeField,
    activeFieldValues,
    activeValue,
    addField,
    editField,
    removeField,
    setActiveValue,
  } = useDictionary();
  const [newFieldValue, setNewFieldValue] = useState('');

  const addNewField = e => {
    e.preventDefault();

    addField(newFieldValue.trim());

    setNewFieldValue('');
  };

  const editNewField = (originalValue, updatedValue, isParent) => {
    return editField(originalValue, updatedValue, null, isParent);
  };

  const removeNewField = value => {
    removeField(value);
  };

  const hasDirtyDependents = dependents => {
    if (activeField !== CLINICAL_TUMOR_DIAGNOSIS) return false;

    return (
      dependents &&
      dependents.some(dependent => dependent.values.some(value => value.status !== 'published'))
    );
  };

  return (
    <FieldValues>
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
              <ButtonPill primary disabled={!newFieldValue.trim()}>
                ADD
              </ButtonPill>
            </AddFieldForm>
          </Row>
          <FieldValueList>
            {activeFieldValues &&
              activeFieldValues.length > 0 &&
              activeFieldValues.map(fieldValue => (
                <EditableFieldValue
                  key={fieldValue._id}
                  initialValue={fieldValue.value}
                  initialState={fieldValue.status}
                  original={fieldValue.original}
                  active={activeValue === fieldValue.value}
                  dirtyDependents={hasDirtyDependents(fieldValue.dependents)}
                  clickHandler={
                    activeField === CLINICAL_TUMOR_DIAGNOSIS
                      ? () => {
                          setActiveValue(
                            fieldValue.value,
                            fieldValue.dependents,
                            fieldValue.original,
                          );
                        }
                      : null
                  }
                  editFn={updatedValue =>
                    editNewField(
                      fieldValue.original || fieldValue.value,
                      updatedValue,
                      activeField === CLINICAL_TUMOR_DIAGNOSIS,
                    )
                  }
                  removeFn={() => removeNewField(fieldValue.value)}
                  resetFn={() =>
                    editNewField(
                      fieldValue.original,
                      fieldValue.original,
                      activeField === CLINICAL_TUMOR_DIAGNOSIS,
                    )
                  }
                />
              ))}
          </FieldValueList>
        </>
      )}
    </FieldValues>
  );
};

export default DictionaryFieldValues;
