import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: {
    black,
    white,
    mineShaft,
    lightPorcelain,
    silver,
    shuttleGrey,
    frenchGrey,
    dodgerBlue,
    keppel,
    silverChalice,
  },
} = base;

const inputPrimaryColour = mineShaft;
const inputBorderColour = frenchGrey;
const checkBoxRadioBorderColour = silver;
const checkboxBlue = dodgerBlue;
const radioColour = keppel;
const fieldDescColour = shuttleGrey;
const disabledBkgColour = lightPorcelain;
const disabledTextColour = silverChalice;

const baseText = css`
  font-size: 13px;
  line-height: 2;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
`;

export const FormBlock = styled('div')`
  display: flex;
  flex-direction: column;
  font-family: ${libreFranklin};
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  input,
  select {
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

    &:first-child {
      margin-top: 5px;
    }
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 0;
    height: 0;

    &:checked ~ span:after {
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

    &:after {
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

    &:after {
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

    &:after {
      left: 2px;
      top: 2px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${radioColour};
    }
  }
`;
