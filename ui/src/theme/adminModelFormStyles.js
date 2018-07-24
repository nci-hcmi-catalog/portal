import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';
import { Row } from 'theme/system';

const {
  fonts: { libreFranklin, openSans },
  palette,
  buttons: { pillBase },
} = base;

const brandPrimary = palette[1];
const bkgColour = palette[12];
const black = '#000';

const baseText = css`
  font-size: 13px;
  line-height: 2;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
`;

export const FormHeader = styled(Row)`
  background-color: ${bkgColour};

  h2 {
    color: ${brandPrimary};
  }
`;

export const FormBody = styled(Row)`
  padding: 20px;
`;

export const FormBlock = styled('div')`
  display: flex;
  flex-direction: column;
  font-family: ${libreFranklin};

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
