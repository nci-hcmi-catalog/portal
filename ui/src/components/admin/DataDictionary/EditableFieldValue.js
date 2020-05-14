import React, { useEffect, useRef, useState } from 'react';

import AdminDictionaryUndoIcon from '../../../icons/AdminDictionaryUndoIcon';
import AdminDictionaryEditIcon from '../../../icons/AdminDictionaryEditIcon';
import AdminDictionarySaveIcon from '../../../icons/AdminDictionarySaveIcon';

import {
  FieldValueListItemContentsWrapper,
  EditFieldForm,
  EditFieldInput,
  FieldStateLabel,
  FieldValueListItem,
  FieldValueListItemLabel,
  FieldValueListItemButton,
  FieldValueListItemContents,
} from 'theme/adminDictionaryStyles';

const EditableFieldValue = ({
  active,
  clickHandler,
  editFn,
  initialValue,
  initialState,
  original,
  removeFn,
  resetFn,
  ...props
}) => {
  let [hovering, setHovering] = useState(false);
  let [value, setValue] = useState(initialValue);
  let [fieldState, setFieldState] = useState(initialState);
  let editableFieldRef = useRef(null);

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

  const startEdit = e => {
    e.stopPropagation();
    setFieldState('editing');
  };

  const saveEdit = e => {
    e.preventDefault();
    e.stopPropagation();

    editFn(value);

    if (value !== initialValue) {
      setFieldState('edited');
    } else {
      setFieldState('default');
    }
  };

  const undoEdit = e => {
    e.stopPropagation();

    resetFn();

    setValue(original);
    setFieldState('default');
  };

  const undoAddNew = e => {
    e.stopPropagation();
    removeFn();
  };

  const handleClick = e => {
    clickHandler && clickHandler();
    startEdit(e);
  };

  useEffect(() => {
    if (fieldState === 'editing' && editableFieldRef && editableFieldRef.current) {
      editableFieldRef.current.focus();
    }
  }, [fieldState]);

  const renderFieldLabel = fieldState => {
    switch (fieldState) {
      case 'editing':
        return (
          <EditFieldForm onSubmit={saveEdit}>
            <EditFieldInput
              type="text"
              value={value}
              onChange={changeHandler}
              onClick={e => e.stopPropagation()}
              onBlur={saveEdit}
              innerRef={editableFieldRef}
            />
          </EditFieldForm>
        );
      default:
        return <FieldValueListItemLabel>{value}</FieldValueListItemLabel>;
    }
  };

  const renderFieldState = fieldState => {
    switch (fieldState) {
      case 'editing':
        return (
          <FieldValueListItemButton>
            <AdminDictionarySaveIcon height={12} width={12} onClick={saveEdit} />
          </FieldValueListItemButton>
        );
      case 'edited':
        return (
          <>
            <FieldStateLabel>edited</FieldStateLabel>
            <FieldValueListItemButton>
              <AdminDictionaryUndoIcon height={12} width={12} onClick={undoEdit} />
            </FieldValueListItemButton>
          </>
        );
      case 'new':
        return (
          <>
            <FieldStateLabel>new</FieldStateLabel>
            <FieldValueListItemButton>
              <AdminDictionaryUndoIcon height={12} width={12} onClick={undoAddNew} />
            </FieldValueListItemButton>
          </>
        );
      default:
        return (
          <FieldValueListItemButton>
            <AdminDictionaryEditIcon
              height={12}
              width={12}
              onClick={startEdit}
              css={!hovering ? 'visibility: hidden;' : ''}
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
      onClick={handleClick}
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
