import { css } from 'emotion';
import styled from 'react-emotion';

import base from 'theme';
import { Row } from 'theme/system';
import { verticalTabHover } from 'theme/hoverStyles';

const {
  fonts: { openSans },
  keyedPalette: { alto, athensLightGray, black, brandPrimary, linen, redDamask, trout, white },
} = base;

const backgroundColour = linen;
const borderColour = redDamask;
const disabledTabColour = athensLightGray;
const horizontalTabHeight = 36;

export const HorizontalTabGroup = styled(Row)`
  label: horizontal-tabs;
`;

const activeTab = css`
  background-color: ${backgroundColour};
  border: solid 1px ${borderColour};
  border-top-width: 3px;
  border-bottom-width: 0px;
  color: ${black};
  font-weight: bold;
  z-index: 2;
  position: relative;
  label: horizontal-tabs__tab--active;

  &:hover {
    background-color: ${backgroundColour};
  }
}`;

const disabledTab = css`
  background-color: ${disabledTabColour};
  color: ${trout};
  cursor: not-allowed;
  label: horizontal-tabs__tab--disabled;

  &:hover {
    background-color: ${disabledTabColour};
  }
`;

export const Tab = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: ${horizontalTabHeight}px;
  min-width: 220px;
  font-family: ${openSans};
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  cursor: pointer;
  label: horizontal-tabs__tab;
  border: solid 1px ${alto};
  border-bottom-width: 0px;
  color: ${brandPrimary};
  background-color: ${white};
  ${verticalTabHover};
  ${({ active }) => active && activeTab};
  ${({ disabled }) => disabled && disabledTab};
`;
