import styled from 'react-emotion';
import base from 'theme';
import { Row } from 'theme/system';

const { palette } = base;

const bkgColour = palette[12];
const borderColour = '#e1e5e7';
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
`;

export const AdminContent = styled(Row)`
  width: 100%;
  padding: 8px;
  background: ${white};
  border: solid 1px ${borderColour};
`;
