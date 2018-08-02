import styled from 'react-emotion';
import { Row } from 'theme/system';

import base from 'theme';
const {
  keyedPalette: { porcelain, white },
} = base;

const borderColour = porcelain;

export const Table = styled('div')`
  width: 100%;
  padding: 8px;
  align-self: center;
  background: ${white};
  border: solid 1px ${borderColour};
  label: models-table-main;
`;
