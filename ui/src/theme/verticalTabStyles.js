import { css } from 'emotion';
import styled from 'react-emotion';

import base from 'theme';
import { Col } from 'theme/system';
import { verticalTabHover } from 'theme/hoverStyles';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: {
    alto,
    aquaSpring,
    brandPrimary,
    elm,
    mineShaft,
    pelorousapprox,
    silver,
    white,
    seaBuckthorn,
    athensGray,
  },
} = base;

const borderColour = pelorousapprox;
const activeTabIconColor = elm;
const disabledTabIconColor = silver;
const verticalTabHeight = 40;

export { brandPrimary, activeTabIconColor, disabledTabIconColor };

export const VerticalTabGroup = styled(Col)`
  min-width: 164px;
  ${({ width }) => width && `width: ${width}px`};
  label: vertical-tabs;
`;

const activeTab = css`
  background-color: ${aquaSpring};
  border: solid 1px ${borderColour};
  border-left-width: 3px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.08);
  padding-left: 8px;
  /* Extending it over 1 pixel to match design (cover other border) */
  z-index: 2;
  position: relative;
  label: vertical-tabs__tab--active;

  &:hover {
    background-color: ${aquaSpring};
  }

  /* Using pseudo-elements to create triangle that extends beyond div */
  &:before,
  &:after {
    content: '';
    position: absolute;
  }

  &:before {
    border-top: ${verticalTabHeight / 2}px solid transparent;
    border-bottom: ${verticalTabHeight / 2}px solid transparent;
    border-left: 13px solid ${borderColour};
    right: -14px;
    top: -1px;
  }

  &:after {
    border-top: ${verticalTabHeight / 2 - 1}px solid transparent;
    border-bottom: ${verticalTabHeight / 2 - 1}px solid transparent;
    border-left: 12px solid ${aquaSpring};
    right: -12px;
    top: 0px;
  }
`;

const disabledTab = css`
  color: ${disabledTabIconColor};
  cursor: not-allowed;
  label: vertical-tabs__tab--disabled;

  &:hover {
    background-color: ${white};
    color: ${disabledTabIconColor};
  }
`;

export const Tab = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${verticalTabHeight}px;
  font-family: ${libreFranklin};
  font-size: 15px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  cursor: pointer;
  label: vertical-tabs__tab;
  border: solid 1px ${alto};
  color: ${brandPrimary};
  background-color: ${white};
  padding-left: 10px;
  ${verticalTabHover};
  ${({ active }) => active && activeTab};
  ${({ disabled }) => disabled && disabledTab};
`;

export const TabContents = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TabLabel = styled('div')`
  display: flex;
  flex-direction: column;
`;

export const TabHeading = styled('span')`
  font-family: ${libreFranklin};
  font-size: 15px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
`;

export const TabSubheading = styled('span')`
  display: flex;
  align-items: center;
  color: ${mineShaft};
  font-family: ${openSans};
  font-size: 10px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.4;
  letter-spacing: normal;
  text-align: left;
`;

export const StatusIndicator = styled('span')`
  display: block;
  width: ${({ size }) => size || '7'}px;
  height: ${({ size }) => size || '7'}px;
  border-radius: 50%;
  background-color: ${seaBuckthorn};
  margin-right: 4px;
`;

export const Divider = styled('div')`
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 10px;
  background-color: ${athensGray};
  border: 1px solid ${alto};
  font-family: ${libreFranklin};
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.71;
  letter-spacing: normal;
`;
