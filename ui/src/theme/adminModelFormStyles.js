import { css } from 'emotion';
import styled from 'react-emotion';
import { Form } from 'formik';
import base from 'theme';
import { Row, Col } from 'theme/system';

const {
  fonts: { libreFranklin, openSans },
  palette,
} = base;

const brandPrimary = palette[1];
const bkgColour = palette[12];
const borderColour = palette[13];
const black = '#000';

const baseText = css`
  font-size: 13px;
  line-height: 2;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
`;

export const ModelForm = styled(Form)`
  width: 100%;

  fieldset {
    padding: 0;
    border: 0;
    margin: 0;
  }
`;

export const FormHeader = styled(Row)`
  width: 100%;
  background-color: ${bkgColour};
  padding: 20px 42px;

  h2 {
    font-family: ${libreFranklin};
    font-size: 22px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.09;
    letter-spacing: normal;
    text-align: left;
    color: ${brandPrimary};
    margin: 0;
  }
`;

export const FormSection = styled(Row)`
  padding: 32px 20px 40px;
`;

export const FormCol = styled(Col)`
  width: 50%;
  padding: 8px 48px 8px 24px;

  &:last-child {
    border-left: 1px solid ${borderColour};
    padding: 8px 24px 8px 48px;
  }
`;

export const FormBlock = styled('div')`
  display: flex;
  flex-direction: column;
  font-family: ${libreFranklin};
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    ${baseText};
    color: ${black};
    font-weight: 500;
    text-transform: uppercase;
  }
`;

export const FormFieldDesc = styled('div')`
  ${baseText};
  font-family: ${openSans};
  font-style: italic;
  color: #64666a;
`;

export const CheckBoxes = styled('div')`
  display: flex;
  flex-direction: column;
`;
