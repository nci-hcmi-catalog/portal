import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';
import CalendarIcon from 'assets/icon-calendar.svg';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: {
    brandPrimary,
    black,
    white,
    mineShaft,
    lightPorcelain,
    silver,
    shuttleGrey,
    frenchGrey,
    dodgerBlue,
    silverChalice,
    dawnPink,
  },
} = base;

const inputPrimaryColour = mineShaft;
const inputBorderColour = frenchGrey;
const checkBoxRadioBorderColour = silver;
const checkboxBlue = dodgerBlue;
const radioColour = dodgerBlue;
const fieldDescColour = shuttleGrey;
const disabledBkgColour = lightPorcelain;
const disabledTextColour = silverChalice;
const errorBkgColour = dawnPink;

const baseText = css`
  font-size: 13px;
  line-height: 2;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
`;

export const FormBlock = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: ${libreFranklin};
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormBlockLabel = styled('label')`
  ${baseText};
  color: ${black};
  font-weight: 500;
  text-transform: uppercase;
`;

export const FormFieldDesc = styled('div')`
  ${baseText};
  font-family: ${openSans};
  font-style: italic;
  color: ${fieldDescColour};
`;

const fieldErrorStyles = css`
  border-color: ${brandPrimary};
`;

const inputSelectSharedStyles = css`
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
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
    color: ${disabledTextColour};
  }
`;

export const Input = styled('input')`
  ${inputSelectSharedStyles};
  width: ${props => props.width || '100%'};
  ${props => !!props.errors && fieldErrorStyles};

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

export const Select = styled('select')`
  ${inputSelectSharedStyles};
  width: ${props => props.width || '100%'};
  ${props => !!props.errors && fieldErrorStyles};
`;

export const AutoCompleteWrapper = styled('div')`
  width: ${props => props.width || '100%'};

  > div {
    width: ${props => props.width || '100%'};
  }

  input {
    ${inputSelectSharedStyles};
    width: ${props => props.width || '100%'};
    ${props => !!props.errors && fieldErrorStyles};
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
    border-radius: 3px;

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
  border-radius: 5px;
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
