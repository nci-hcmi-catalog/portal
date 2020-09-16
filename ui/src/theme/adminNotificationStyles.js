import styled, { keyframes } from 'react-emotion';
import { css } from 'emotion';
import { Element } from 'react-scroll';

import { NOTIFICATION_TYPES } from './../components/admin/Notifications';

import base from 'theme';
import { brandPrimaryHighlightHover } from 'theme/hoverStyles';

const {
  fonts: { openSans },
  keyedPalette: { aquaSpring, black, cinderella, mauvelous, morningGlory, yellowOrange },
  transparency: { yellowOrange20 },
} = base;

const successBkgColour = aquaSpring;
const successColour = morningGlory;
const errorBkgColour = cinderella;
const warningBkgColour = yellowOrange20;
const errorColour = mauvelous;
const warningColour = yellowOrange;
const textColour = black;

export const NotificationsToaster = styled(Element)`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 10px 0 5px;
  label: notifications-toaster;
`;

const NotificationAnim = keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
`;

export const Notification = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  background: ${({ type }) => {
    if (type === NOTIFICATION_TYPES.ERROR) {
      return errorBkgColour;
    } else if (type === NOTIFICATION_TYPES.WARNING || type === NOTIFICATION_TYPES.LOADING) {
      return warningBkgColour;
    } else {
      return successBkgColour;
    }
  }};
  border: 2px solid;
  border-color: ${({ type }) => {
    if (type === NOTIFICATION_TYPES.ERROR) {
      return errorColour;
    } else if (type === NOTIFICATION_TYPES.WARNING || type === NOTIFICATION_TYPES.LOADING) {
      return warningColour;
    } else {
      return successColour;
    }
  }};
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  font-family: ${openSans};
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: ${textColour};
  animation: ${NotificationAnim} 1s ease;
  label: notification;

  &:last-child {
    margin-bottom: 0;
    label: last;
  }
`;

export const Message = styled('span')`
  font-weight: bold;
  label: notification-message;
`;

export const Details = styled('span')`
  label: notification-details;
`;

export const ErrorsRow = styled('div')`
  display: flex;
  flex-direction: row;
  font-family: ${openSans};
  margin-top: ${({ marginTop }) => marginTop || 0};
  margin-bottom: ${({ marginBottom }) => marginBottom || 0};
  label: errors-row;

  &:last-child {
    margin-bottom: 0;
    label: last;
  }
`;

export const ErrorsCol = styled('div')`
  display: flex;
  flex-direction: column;
  font-family: ${openSans};
  margin-top: ${({ marginTop }) => marginTop || 0};
  margin-bottom: ${({ marginBottom }) => marginBottom || 0};
  label: errors-col;

  &:last-child {
    margin-bottom: 0;
    label: last;
  }
`;

export const ErrorLabel = styled('span')`
  font-size: 12px;
  margin-right: 6px;
  font-weight: bold;
  label: error-label;
`;

export const ErrorText = styled('span')`
  font-size: 12px;
  font-weight: normal;
  label: error-text;
`;

export const MessageLink = styled('a')`
  ${brandPrimaryHighlightHover}
  text-decoration: underline;
  label: notification-message-link;
`;

export const closeIcon = css`
  margin-right: 0;
  margin-left: auto;
  cursor: pointer;
`;
