import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';

import { AdminContent, AdminHeaderH1 } from 'theme/adminStyles';
import { Col } from 'theme/system';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: {
    aquaSpring,
    athensGray,
    deepIron,
    elm,
    mineShaft,
    pelorousapprox,
    porcelain,
    white,
  },
} = base;

const borderColour = porcelain;

export const DataDictionaryH1 = styled(AdminHeaderH1)`
  font-size: 26px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  color: ${mineShaft};
`;

export const AdminDictionaryContent = styled(AdminContent)`
  display: flex;
  flex-direction: row;
  width: calc(100% - 280px);
  min-height: 416px;
  z-index: 1;
  padding: 24px 28px;
  label: admin-dictionary-content;
`;

export const AdminDictionaryContentColumn = styled(Col)`
  width: 50%;
`;

export const FieldValues = styled(AdminDictionaryContentColumn)`
  border-right: 1px solid transparent;
  ${({ selected }) => selected && `border-color: ${borderColour}`};
`;

export const DependentValues = styled(AdminDictionaryContentColumn)`
  padding-left: 28px;
`;

export const DictionaryColumnHeading = styled('h2')`
  margin-top: 0;
  font-family: ${libreFranklin};
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.71;
  letter-spacing: normal;
`;

export const AddFieldForm = styled('form')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-right: 18px;
`;

export const AddFieldInput = styled('input')`
  height: 28px;
  width: calc(100% - 72px);
  border-radius: 4px;
  border: solid 1px #b2b7c1;
  padding: 6px 10px;
  font-family: ${openSans};
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;

  &::placeholder {
    color: #525767;
  }

  &:active,
  &:focus,
  &:hover {
    border-color: #4596de;
  }
`;

export const disabledFieldButton = css`
  color: ${white};
  background-color: #cecfd3;

  &:hover {
    color: ${white};
    background-color: #cecfd3;
    cursor: not-allowed;
  }
`;

export const AddFieldButton = styled('button')`
  height: 28px;
  width: 62px;
  color: ${white};
  background-color: ${elm};
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${pelorousapprox};
  }

  ${({ disabled }) => disabled && disabledFieldButton};
`;

export const disabledPill = css`
  background-color: ${deepIron};
  &:hover {
    background-color: ${deepIron};
  }
`;

export const cancelPill = css`
  background-color: ${white};
  color: ${mineShaft};
  &:hover {
    background-color: ${athensGray};
    color: ${mineShaft};
  }
`;

export const actionPill = css`
  background-color: ${elm};
  &:hover {
    background-color: ${pelorousapprox};
  }
`;

export const FieldValueList = styled('ol')`
  list-style: none;
  counter-reset: item;
  padding: 0;
`;

const fieldValueListItemHeight = 34;
const activeItem = css`
  background-color: ${aquaSpring};
  border: solid 1px ${pelorousapprox};
  border-left-width: 3px;
  border-right: 0;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.08);
  margin-right: 0;
  padding-left: 29px;
  padding-right: 18px;
  z-index: 2;
  position: relative;

  &:hover {
    background-color: ${aquaSpring};
  }

  /* Using pseudo-elements to create triangle that extends beyond div */
  &:before,
  &:after {
    content: '';
    position: absolute;
  }

  &:before {
    border-top: ${fieldValueListItemHeight / 2}px solid transparent;
    border-bottom: ${fieldValueListItemHeight / 2}px solid transparent;
    border-left: 13px solid ${pelorousapprox};
    right: -13px;
    top: -1px;
  }

  &:after {
    border-top: ${fieldValueListItemHeight / 2 - 1}px solid transparent;
    border-bottom: ${fieldValueListItemHeight / 2 - 1}px solid transparent;
    border-left: 12px solid ${aquaSpring};
    right: -12px;
    top: 0px;
  }
`;

export const FieldValueListItem = styled('li')`
  counter-increment: item;
  font-size: 12px;
  position: relative;
  cursor: pointer;

  &::before {
    content: counters(item, '.') '. ';
    color: #1c8292;
    width: 18px;
    text-align: right;
    display: inline-block;
    padding-bottom: 1px;
    position: absolute;
    z-index: 3;
    top: 50%;
    left: 8px;
    transform: translateY(-50%);
  }
`;

export const FieldValueListItemContents = styled('div')`
  height: ${fieldValueListItemHeight}px;
  display: flex;
  align-items: center;
  margin-right: 18px;
  padding-left: 32px;

  &:hover {
    background-color: #f6f6f8;
  }

  ${({ active }) => active && activeItem};
`;

const dirtyItem = css`
    height: ${fieldValueListItemHeight - 4}px;
    width: calc(100% + 28px);
    margin-left: -28px;
    padding-left: 28px;
    border: 1px dashed #f5a528;
  }
`;

export const FieldValueListItemContentsWrapper = styled('div')`
  height: ${fieldValueListItemHeight}px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  ${({ dirty }) => dirty && dirtyItem};
`;

export const FieldValueListItemLabel = styled('span')`
  display: flex;
  margin-right: auto;
`;

export const FieldValueListItemButton = styled('button')`
  display: flex;
  margin-right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const EditFieldInput = styled(AddFieldInput)`
  margin-right: auto;
`;

export const FieldStateLabel = styled('span')`
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: italic;
  margin-right: 12px;
`;
