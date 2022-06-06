import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { css } from '@emotion/react';
import { Element } from 'react-scroll';

import { NOTIFICATION_TYPES } from './../components/admin/Notifications';

import base from 'theme';
import { brandPrimaryHighlightHover } from 'theme/hoverStyles';
import { Col, Row } from 'theme/system';

const {
  fonts: { openSans },
  keyedPalette: {
    aquaSpring,
    black,
    bombay,
    cinderella,
    cinnabar,
    elm,
    ironApprox,
    mauvelous,
    morningGlory,
    stiletto,
    white,
    yellowOrange,
  },
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

export const closeIconDisabled = css`
  margin-right: 0;
  margin-left: auto;
  cursor: not-allowed;
`;

export const NotificationTableHeaderRow = styled(Row)`
  border-bottom: 1px solid ${bombay};
`;

export const NotificationTableHeaderCol = styled(Col)`
  width: 50%;

  &:first-child {
    border-right: 1px solid ${bombay};
  }

  &:last-child {
    padding-left: 16px;
  }
`;

export const ShowHideButton = styled('button')`
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
  font-family: ${openSans};
  font-size: 12px;
  font-weight: bold;
  line-height: normal;
  text-align: center;
`;

export const ShowHideButtonLabel = styled('span')`
  color: ${stiletto};

  &:hover {
    text-decoration: underline;
  }
`;

export const PlusMinusIcon = styled('span')`
  color: ${white};
  background: ${cinnabar};
  border-radius: 100%;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  margin-right: 4px;
  ${({ showMore }) => showMore && 'padding-bottom: 2px;'}
`;

export const ProgressBarContainer = styled('div')`
  display: block;
  width: 290px;
  height: 14px;
  border-radius: 10px;
  border: solid 1px ${bombay};
  overflow: hidden;
  position: relative;
  margin-top: 4px;
`;

export const ProgressBarWrapper = styled('div')`
  display: flex;
`;

export const ProgressBarSectionComplete = styled('span')`
  display: inline-block;
  height: 12px;
  background: ${elm};
  ${({ num, total }) => `width: calc(${num}/${total} * 100%);`}
`;

export const ProgressBarSectionFailed = styled('span')`
  display: inline-block;
  height: 12px;
  background: ${cinnabar};
  ${({ num, total }) => `width: calc(${num}/${total} * 100%);`}
`;

export const ProgressBarSectionIncomplete = styled('span')`
  display: inline-block;
  height: 12px;
  background: ${ironApprox};
  ${({ num, total }) => `width: calc(${num}/${total} * 100%);`}
`;

export const ProgressBarLabel = styled('span')`
  display: flex;
  align-items: center;
`;
