import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';

import { SmallPill } from 'theme/adminControlsStyles';
import { AdminContainer, AdminContent, AdminHeader } from 'theme/adminStyles';
import { Col } from 'theme/system';
import { Row } from 'theme/system';

const {
  fonts: { openSans },
  keyedPalette: {
    aquaSpring,
    athensGray,
    athensLightGray,
    bombay,
    brandPrimary,
    elm,
    havelockBlue,
    pelorousapprox,
    porcelain,
    seaBuckthorn,
    tiaMaria,
    trout,
  },
} = base;

const borderColour = porcelain;

export const DictionaryContainer = styled(AdminContainer)`
  margin-bottom: 40px;
`;

export const DataDictionaryHeader = styled(AdminHeader)`
  position: relative;
  padding-top: 32px;
`;

export const HeaderPill = styled(SmallPill)`
  background-color: ${tiaMaria};
  border-color: ${tiaMaria};
  margin: auto 10px;
`;

export const DictionaryDraftTimestamp = styled('span')`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  padding-left: 2px;
  height: 40px;
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;

  span {
    margin: auto 10px;
  }
`;

export const DictionaryDraftStats = styled('span')`
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;

  span {
    margin: auto 10px;
  }
`;

export const AdminDictionaryContent = styled(AdminContent)`
  display: flex;
  flex-direction: row;
  ${({ tabWidth }) => tabWidth && `width: calc(100% - ${tabWidth}px)`};
  min-height: 416px;
  z-index: 1;
  padding: 24px 28px;
  label: admin-dictionary-content;
`;

export const AdminDictionaryContentColumn = styled(Col)`
  width: 50%;
`;

export const FieldValues = styled(AdminDictionaryContentColumn)``;

export const DependentValues = styled(AdminDictionaryContentColumn)`
  padding-left: 28px;
  border-left: 1px solid ${borderColour};
`;

export const DependentValuesHeader = styled(Row)`
  justify-content: space-between;
`;

export const DependentFieldType = styled('h3')`
  font-family: ${openSans};
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  background-image: linear-gradient(to bottom, ${athensGray} 13%, ${athensLightGray} 88%);
  padding: 8px;
  border-top: 1px solid ${borderColour};
  cursor: pointer;
`;

export const DictionaryColumnHeading = styled('h2')`
  margin-top: 0;
  font-family: ${openSans};
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.71;
  letter-spacing: normal;
`;

export const DependentColumnHeading = styled(DictionaryColumnHeading)`
  max-width: calc(100% - 120px);
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
  border: solid 1px ${bombay};
  padding: 6px 10px;
  font-family: ${openSans};
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;

  &::placeholder {
    color: ${trout};
  }

  &:active,
  &:focus,
  &:hover {
    border-color: ${havelockBlue};
  }
`;

export const FieldValueList = styled('ol')`
  list-style: none;
  counter-reset: item;
  padding: 0;
`;

const fieldValueListItemHeight = 34;
const activeItem = css`
  cursor: default;
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

  &::before {
    content: counters(item, '.') '. ';
    color: ${elm};
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
  cursor: pointer;

  &:hover {
    background-color: ${athensGray};
  }

  ${({ active }) => active && activeItem};
`;

const dirtyItem = css`
  border-color: ${seaBuckthorn};
`;

const errorItem = css`
  border-color: ${brandPrimary};
`;

export const FieldValueListItemContentsWrapper = styled('div')`
  height: ${fieldValueListItemHeight - 4}px;
  width: calc(100% + 28px - 4px);
  margin-left: -28px;
  padding-left: 28px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border: 1px dashed transparent;

  ${({ dirty }) => dirty && dirtyItem};
  ${({ error }) => error && errorItem};
`;

export const FieldValueListItemLabel = styled('span')`
  display: flex;
  margin-right: auto;
  align-items: center;
`;

export const FieldValueListItemButton = styled('button')`
  display: flex;
  height: 100%;
  padding: 8px;
  border: none;
  background: transparent;
  color: ${elm};
  cursor: pointer;
`;

export const EditFieldForm = styled('form')`
  width: calc(100% - 68px);
  margin-right: auto;
`;

export const EditFieldInput = styled(AddFieldInput)`
  width: 100%;
  margin-right: auto;
`;

export const FieldStateLabel = styled('span')`
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: italic;
  margin-right: 12px;
`;
