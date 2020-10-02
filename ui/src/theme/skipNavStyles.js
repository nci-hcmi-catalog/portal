import styled from 'react-emotion';

import base from 'theme';

const {
  keyedPalette: { black, linen, redDamask },
} = base;

export const SkipNavWrapper = styled('div')`
  margin: 0;
  padding: 0;
`;

export const SkipNavLink = styled('a')`
  position: fixed;
  top: -9999px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px;
  background-color: ${linen};
  border: 2px solid ${redDamask};
  color: ${black};
  text-decoration: none;
  font-weight: bold;
  z-index: 9999;

  &:focus {
    top: 16px;
  }
`;
