import styled from 'react-emotion';
import base from 'theme';
import { Row } from 'theme/system';

const {
  fonts: { libreFranklin },
  palette,
} = base;

const brandPrimary = palette[1];
const bkgColour = palette[12];
const borderColour = palette[13];
const white = '#fff';

export const AdminWrapper = styled(Row)`
  background: ${bkgColour};
`;

export const AdminPage = styled('div')`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const AdminHeader = styled(Row)`
  width: 100%;
  padding: 36px 0 28px;
  justify-content: space-between;

  h1 {
    font-family: ${libreFranklin};
    line-height: 1;
    color: ${brandPrimary};
    font-size: 28px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    margin: 0;
  }
`;

export const AdminContent = styled(Row)`
  width: 100%;
  padding: 8px;
  background: ${white};
  border: solid 1px ${borderColour};
`;
