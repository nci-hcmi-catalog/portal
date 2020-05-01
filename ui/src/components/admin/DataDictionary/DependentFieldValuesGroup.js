import React from 'react';

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
  fieldName,
  fieldKey,
  fieldValues,
  newFieldValue,
  submitHandler,
  changeHandler,
  toggleHandler,
  deleteHandler,
  expanded = false,
}) => {
  return (
    <>
      <DependentFieldType onClick={() => toggleHandler(fieldKey)}>
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
            <AddFieldForm onSubmit={e => submitHandler(e, fieldKey, newFieldValue)}>
              <AddFieldInput
                type="text"
                id="new-field"
                name="new-field"
                placeholder="Add a new value..."
                value={newFieldValue}
                onChange={e => {
                  e.preventDefault();
                  changeHandler(e.target.value);
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
                  removeFn={() => deleteHandler(x.value, fieldKey)}
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
