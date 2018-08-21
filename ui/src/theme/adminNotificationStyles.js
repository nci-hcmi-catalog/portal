import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import base from 'theme';

const {
  fonts: { openSans },
  keyedPalette: { brandPrimary, pelorousapprox },
  transparency: { brandPrimary20, pelorousapprox20 },
} = base;

const successBkgColor = pelorousapprox20;
const successBorderColor = pelorousapprox;
const errorBkgColor = brandPrimary20;
const errorBorderColor = brandPrimary;

export const NotificationsToaster = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: ${openSans};
  margin: 15px 0 0;
`;

export const Notification = styled('div')`
  display: flex;
  flex-direction: row;
  width: 100%;
  background: ${({ error }) => {
    if (error) {
      return errorBkgColor;
    } else {
      return successBkgColor;
    }
  }};
  border: 2px solid;
  border-color: ${({ error }) => {
    if (error) {
      return errorBorderColor;
    } else {
      return successBorderColor;
    }
  }};
  border-radius: 5px;
  padding: 14px;
`;
