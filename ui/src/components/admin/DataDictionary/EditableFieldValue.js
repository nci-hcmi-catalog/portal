import React, { useState } from 'react';

import AdminDictionaryUndoIcon from '../../../icons/AdminDictionaryUndoIcon';
import AdminEditPencilIcon from '../../../icons/AdminEditPencilIcon';
import AdminModelSaveIcon from '../../../icons/AdminModelSaveIcon';

import {
  FieldValueListItemContentsWrapper,
  EditFieldInput,
  FieldStateLabel,
  FieldValueListItem,
  FieldValueListItemLabel,
  FieldValueListItemButton,
  FieldValueListItemContents,
  iconColor,
} from 'theme/adminDictionaryStyles';

const EditableFieldValue = ({ active, initialValue, initialState, removeFn, ...props }) => {
  let [hovering, setHovering] = useState(false);
  let [value, setValue] = useState(initialValue);
  let [fieldState, setFieldState] = useState(initialState);

  const isDirty = () => {
    return fieldState === 'edited' || fieldState === 'new';
  };

  const hoverHandler = () => {
    setHovering(true);
  };

  const unhoverHandler = () => {
    setHovering(false);
  };

  const changeHandler = e => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const startEdit = () => {
    setFieldState('editing');
  };

  const saveEdit = () => {
    if (value !== initialValue) {
      setFieldState('edited');
    } else {
      setFieldState('default');
    }
  };

  const undoEdit = () => {
    setValue(initialValue);
    setFieldState('default');
  };

  const undoAddNew = () => {
    removeFn(initialValue);
  };

  const renderFieldLabel = fieldState => {
    switch (fieldState) {
      case 'editing':
        return <EditFieldInput type="text" value={value} onChange={changeHandler} />;
      default:
        return <FieldValueListItemLabel>{value}</FieldValueListItemLabel>;
    }
  };

  const renderFieldState = fieldState => {
    switch (fieldState) {
      case 'editing':
        return (
          <FieldValueListItemButton>
            <AdminModelSaveIcon height={12} width={12} fill={iconColor} onClick={saveEdit} />
          </FieldValueListItemButton>
        );
      case 'edited':
        return (
          <>
            <FieldStateLabel>edited</FieldStateLabel>
            <FieldValueListItemButton>
              <AdminDictionaryUndoIcon height={12} width={12} fill={iconColor} onClick={undoEdit} />
            </FieldValueListItemButton>
          </>
        );
      case 'new':
        return (
          <>
            <FieldStateLabel>new</FieldStateLabel>
            <FieldValueListItemButton>
              <AdminDictionaryUndoIcon
                height={12}
                width={12}
                fill={iconColor}
                onClick={undoAddNew}
              />
            </FieldValueListItemButton>
          </>
        );
      default:
        return (
          <FieldValueListItemButton>
            <AdminEditPencilIcon
              height={12}
              width={12}
              fill={iconColor}
              css={!hovering ? 'visibility: hidden;' : ''}
              onClick={startEdit}
            />
          </FieldValueListItemButton>
        );
    }
  };

  return (
    <FieldValueListItem
      onMouseOver={hoverHandler}
      onFocus={hoverHandler}
      onMouseOut={unhoverHandler}
      onBlur={unhoverHandler}
      {...props}
    >
      <FieldValueListItemContents active={active}>
        <FieldValueListItemContentsWrapper dirty={isDirty()}>
          {renderFieldLabel(fieldState)}
          {renderFieldState(fieldState)}
        </FieldValueListItemContentsWrapper>
      </FieldValueListItemContents>
    </FieldValueListItem>
  );
};

export default EditableFieldValue;
