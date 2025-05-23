import { css } from '@emotion/react';
import styled from '@emotion/styled';
import base from 'theme';
import CalendarIcon from 'assets/icon-calendar.svg';
import chevron from 'assets/icon-chevron-down.svg';

const {
  fonts: { openSans },
  keyedPalette: {
    athensGray,
    athensLightGray,
    black,
    bombay,
    brandPrimary,
    dawnPink,
    dodgerBlue,
    lightPorcelain,
    mineShaft,
    sandyBeach,
    seaBuckthorn,
    trout,
    white,
  },
} = base;

const inputPrimaryColour = black;
const inputBorderColour = bombay;
const checkBoxRadioBorderColour = bombay;
const checkboxBlue = dodgerBlue;
const radioColour = dodgerBlue;
const fieldDescColour = trout;
const disabledBkgColour = athensGray;
const disabledBorderColour = athensLightGray;
const disabledTextColour = trout;
const errorBkgColour = dawnPink;

const baseText = css`
  font-family: ${openSans};
  font-size: 14px;
  font-style: normal;
  color: ${black};
`;

export const FormBlock = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: ${openSans};
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormBlockLabel = styled('label')`
  ${baseText};
  font-weight: bold;
  margin-bottom: 4px;
`;

export const FormFieldDesc = styled('div')`
  ${baseText};
  font-size: 12px;
  font-style: italic;
  margin-bottom: 4px;
  color: ${fieldDescColour};
`;

export const FormWarningLabel = styled('div')`
  font-family: ${openSans};
  font-size: 12px;
  font-weight: normal;
  color: ${black};
  background-color: ${sandyBeach};
  border-radius: 4px;
  padding: 2px 10px;
  margin-bottom: 4px;
  position: relative;

  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 3px solid ${sandyBeach};
    position: absolute;
    bottom: -3px;
    left: 12px;
  }
`;

const fieldErrorStyles = css`
  border-color: ${brandPrimary};
`;

const fieldWarningStyles = css`
  border-color: ${seaBuckthorn};
`;

const inputSelectSharedStyles = css`
  height: 36px;
  padding: 0 12px;
  border-radius: 4px;
  background-color: ${white};
  border: solid 1px ${inputBorderColour};
  font-family: ${openSans};
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 36px;
  letter-spacing: normal;
  text-align: left;
  color: ${inputPrimaryColour};

  &:focus {
    border-radius: 0;
  }

  &:disabled {
    background: ${disabledBkgColour};
    border-color: ${disabledBorderColour};
    color: ${disabledTextColour};
    cursor: not-allowed;
  }
`;

export const Input = styled('input')`
  ${inputSelectSharedStyles};
  width: ${(props) => props.width || '100%'};
  ${(props) => !!props.errors && fieldErrorStyles};

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

// TODO: refactor shared Select/Dropdown styles into a component
export const Select = styled('select')`
  ${inputSelectSharedStyles};
  width: ${(props) => props.width || '100%'};

  appearance: none;
  box-sizing: border-box;
  background-color: ${white};
  background-image: url(${chevron}),
    linear-gradient(
      90deg,
      transparent 0%,
      transparent calc(100% - 37px),
      ${bombay} calc(100% - 37px),
      ${bombay} calc(100% - 36px),
      transparent calc(100% - 36px),
      transparent 100%
    );
  background-repeat: no-repeat;
  background-size: 10px, contain;
  background-position: bottom 12px right 12px, 0 0;
  cursor: pointer;
  transition: background-color 0.25s ease;

  &:not(:disabled) {
    &:hover {
      background-color: ${lightPorcelain};
      background-image: url(${chevron}),
        linear-gradient(
          90deg,
          transparent 0%,
          transparent calc(100% - 37px),
          ${bombay} calc(100% - 37px),
          ${bombay} calc(100% - 36px),
          transparent calc(100% - 36px),
          transparent 100%
        );
    }
  }

  ${(props) => !!props.errors && fieldErrorStyles};
`;

export const AutoCompleteWrapper = styled('div')`
  width: ${(props) => props.width || '100%'};

  > div {
    width: ${(props) => props.width || '100%'};
  }

  input {
    ${inputSelectSharedStyles};
    width: ${(props) => props.width || '100%'};
    ${(props) => !!props.errors && fieldErrorStyles};
    ${(props) => !!props.warning && fieldWarningStyles};
  }
`;

export const AutoCompleteMenu = styled('div')`
  position: absolute;
  z-index: 3;
  width: 100%;
  background: ${white};
  font-family: ${openSans};
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  color: ${inputPrimaryColour};
  max-height: 120px;
  overflow-y: auto;
  border: solid 1px ${inputBorderColour};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

export const AutoCompleteOption = styled('div')`
  line-height: 28px;
  padding: 0 12px;
  background: ${({ highlighted }) => (highlighted ? disabledBkgColour : 'none')};
  cursor: pointer;
`;

export const AutoCompleteClearButton = styled('div')`
  position: absolute;
  width: 25px !important;
  right: 3px;
  bottom: 3px;
  cursor: pointer;
`;

export const DatePicker = styled('input')`
  ${inputSelectSharedStyles};
  background: ${white} url(${CalendarIcon}) no-repeat;
  background-position: right 11px center;
  background-size: 19px 19px;
  padding-right: 44px;
  cursor: pointer;
  label: model-form-datepicker;

  &::-webkit-inner-spin-button {
    display: none;
  }
  &::-webkit-calendar-picker-indicator {
    position: relative;
    right: -44px;
    width: 44px;
    height: 36px;
    opacity: 0;
    cursor: pointer;
  }
`;

const checkboxRadioSharedStyles = css`
  label {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    cursor: pointer;
    margin-bottom: 14px;
    padding-left: 21px;
    font-family: ${openSans};
    font-size: 13.5px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: normal;
    text-align: left;
    color: ${mineShaft};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:first-of-type {
      margin-top: 5px;
    }
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 0;
    height: 0;

    &:checked ~ span::after {
      display: block;
    }
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 14px;
    height: 14px;
    background-color: ${white};
    border: solid 1px ${checkBoxRadioBorderColour};

    &::after {
      content: '';
      position: absolute;
      display: none;
    }
  }
`;

export const CheckBoxes = styled('fieldset')`
  display: flex;
  flex-direction: column;
  ${checkboxRadioSharedStyles};

  label:hover input ~ span {
    background-color: ${checkBoxRadioBorderColour};
  }

  span {
    border-radius: 2px;

    &::after {
      left: 4px;
      top: 1px;
      width: 2px;
      height: 6px;
      border: solid white;
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }

  input:checked ~ span {
    background-color: ${checkboxBlue};
  }
`;

export const RadioSelect = styled('fieldset')`
  display: flex;
  flex-direction: column;
  ${checkboxRadioSharedStyles};

  span {
    border-radius: 50%;

    &::after {
      left: 2px;
      top: 2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${radioColour};
    }
  }
`;

export const FormFieldError = styled('div')`
  position: relative;
  font-family: ${openSans};
  font-size: 12px;
  font-weight: normal;
  line-height: 1.5;
  padding: 2px 6px;
  color: ${brandPrimary};
  border-radius: 4px;
  background-color: ${errorBkgColour};
  margin-bottom: 6px;

  &::after {
    display: block;
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    bottom: -5px;
    left: 9px;
    border-style: solid;
    border-width: 5px 3px 0 3px;
    border-color: ${errorBkgColour} transparent transparent transparent;
  }
`;

const errorIconBase = css`
  position: absolute;
  width: 25px;
  height: 25px;
  margin: 0;
  right: -31px;
`;

export const inputSelectErrorIcon = css`
  ${errorIconBase};
  bottom: 5px;
`;

export const checkboxRadioErrorIcon = css`
  ${errorIconBase};
  right: -31px;
  top: 50%;
  transform: translateY(-50%);
`;
