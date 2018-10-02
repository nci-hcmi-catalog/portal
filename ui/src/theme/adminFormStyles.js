import styled from 'react-emotion';
import { Form } from 'formik';
import base from 'theme';
import { Row, Col } from 'theme/system';

const {
  fonts: { libreFranklin },
  keyedPalette: { brandPrimary, lightPorcelain, porcelain },
} = base;

const bkgColour = lightPorcelain;
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
  padding: 18px 42px;

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
