import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';

import { AdminContent } from 'theme/adminStyles';

const {
  keyedPalette: { athensGray, deepIron, elm, mineShaft, pelorousapprox, white },
} = base;

export const AdminDictionaryContent = styled(AdminContent)`
  display: flex;
  flex-direction: column;
  width: calc(100% - 280px);
  min-height: 416px;
  z-index: 1;
  padding: 24px 28px;
  label: admin-dictionary-content;
`;

export const disabledPill = css`
  background-color: ${deepIron};
  &:hover {
    background-color: ${deepIron};
  }
`;

export const cancelPill = css`
  background-color: ${white};
  color: ${mineShaft};
  &:hover {
    background-color: ${athensGray};
    color: ${mineShaft};
  }
`;

export const actionPill = css`
  background-color: ${elm};
  &:hover {
    background-color: ${pelorousapprox};
  }
`;
