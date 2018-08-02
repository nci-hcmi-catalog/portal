import styled from 'react-emotion';
import { css } from 'emotion';
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

export const tableCheckbox = css`
  &.ReactTable .rt-thead.-header {
    padding-right: 10px;
  }
  label: models-table-checkbox;
`;
