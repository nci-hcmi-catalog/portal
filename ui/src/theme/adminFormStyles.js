import styled from '@emotion/styled';
import { Form } from 'formik';
import base from 'theme';
import { Row, Col } from 'theme/system';

const {
  fonts: { openSans },
  keyedPalette: { athensLightGray, black, porcelain },
} = base;

const bkgColour = athensLightGray;
const borderColour = porcelain;

export const FormContainer = styled(Form)`
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
  padding: 4px 15px;
  align-items: center;

  h2 {
    font-family: ${openSans};
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: left;
    text-transform: uppercase;
    color: ${black};
    margin: 0;
  }
`;

export const FormSection = styled(Row)`
  padding: 16px 8px;
`;

export const FormCol = styled(Col)`
  width: 50%;
  padding: 0 48px 0 0;

  &:last-child {
    border-left: 1px solid ${props => (props.noBorder ? 'transparent' : borderColour)};
    padding: 0 20px 0 32px;
  }
`;
