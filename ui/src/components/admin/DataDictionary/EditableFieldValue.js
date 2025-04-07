import React, { useEffect, useContext, useRef, useState } from 'react';
import { css } from '@emotion/react';

import { NotificationsContext, NOTIFICATION_TYPES } from './../Notifications';

import UndoIcon from '../../../icons/UndoIcon';
import EditIcon from '../../../icons/EditIcon';
import SaveIcon from '../../../icons/SaveIcon';

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
import { StatusIndicator } from 'theme/verticalTabStyles';

const EditableFieldValue = ({
  active,
  clickHandler,
  dirtyDependents,
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
  const { appendNotification } = useContext(NotificationsContext);

  const isDirty = () => {
    return fieldState === 'edited' || fieldState === 'error' || fieldState === 'new';
  };

  const isError = () => {
    return fieldState === 'error';
  };

  const hoverHandler = () => {
    setHovering(true);
  };

  const unhoverHandler = () => {
    setHovering(false);
  };

  const changeHandler = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const clearError = (e) => {
    e.preventDefault();
    setFieldState(initialState);
    setValue(initialValue);
  };

  const startEdit = (e) => {
    setFieldState('editing');
  };

  const saveEdit = (e) => {
    e.preventDefault();

    if (!value || !value.trim()) {
      appendNotification({
        type: NOTIFICATION_TYPES.ERROR,
        message: 'Warning:',
        details: 'Blank values will not be saved to the dictionary.',
        timeout: false,
      });
      setFieldState('error');
    } else if (value !== initialValue) {
      editFn(value).then((success) => {
        if (success) {
          setFieldState(initialState === 'new' ? initialState : 'edited');
        } else {
          setValue(initialValue);
          setFieldState(initialState);
        }
      });
    } else {
      setFieldState(initialState);
    }
  };

  const undoEdit = (e) => {
    e.stopPropagation();

    resetFn();

    setValue(original);
    setFieldState('default');
  };

  const undoAddNew = (e) => {
    e.stopPropagation();
    removeFn();
  };

  const handleClick = (e) => {
    clickHandler && clickHandler();
    fieldState !== 'editing' && startEdit(e);
  };

  useEffect(() => {
    if (fieldState === 'editing' && editableFieldRef && editableFieldRef.current) {
      editableFieldRef.current.focus();
    }
  }, [fieldState]);

  useEffect(() => {
    setFieldState(initialState);
  }, [initialState]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const renderFieldLabel = (fieldState) => {
    switch (fieldState) {
      case 'editing':
        return (
          <EditFieldForm onSubmit={saveEdit}>
            <EditFieldInput
              type="text"
              value={value}
              onChange={changeHandler}
              onMouseDown={(e) => e.stopPropagation()}
              onBlur={saveEdit}
              innerRef={editableFieldRef}
            />
          </EditFieldForm>
        );
      default:
        return (
          <FieldValueListItemLabel>
            {dirtyDependents && <StatusIndicator margin={8} />}
            {value}
          </FieldValueListItemLabel>
        );
    }
  };

  const renderFieldState = (fieldState) => {
    switch (fieldState) {
      case 'editing':
        return (
          <FieldValueListItemButton aria-label="Save changes" onMouseDown={saveEdit}>
            <SaveIcon height={'12px'} width={'12px'} />
          </FieldValueListItemButton>
        );
      case 'edited':
        return (
          <>
            <FieldStateLabel>edited</FieldStateLabel>
            <FieldValueListItemButton aria-label="Undo changes" onMouseDown={undoEdit}>
              <UndoIcon />
            </FieldValueListItemButton>
          </>
        );
      case 'error':
        return (
          <>
            <FieldStateLabel>error</FieldStateLabel>
            <FieldValueListItemButton aria-label="Clear error" onMouseDown={clearError}>
              <UndoIcon />
            </FieldValueListItemButton>
          </>
        );
      case 'new':
        return (
          <>
            <FieldStateLabel>new</FieldStateLabel>
            <FieldValueListItemButton aria-label="Remove this value" onMouseDown={undoAddNew}>
              <UndoIcon />
            </FieldValueListItemButton>
          </>
        );
      default:
        return (
          <FieldValueListItemButton aria-label="Edit">
            <EditIcon
              height={'12px'}
              width={'12px'}
              onMouseDown={startEdit}
              css={css`
                ${!hovering ? 'visibility: hidden;' : ''}
              `}
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
      onMouseDown={handleClick}
      {...props}
    >
      <FieldValueListItemContents active={active}>
        <FieldValueListItemContentsWrapper dirty={isDirty()} error={isError()}>
          {renderFieldLabel(fieldState)}
          {renderFieldState(fieldState)}
        </FieldValueListItemContentsWrapper>
      </FieldValueListItemContents>
    </FieldValueListItem>
  );
};

export default EditableFieldValue;
