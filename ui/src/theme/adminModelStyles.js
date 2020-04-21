import { css } from 'emotion';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import base from 'theme';
import { Col } from 'theme/system';
import { AdminContent, AdminHeaderH1 } from 'theme/adminStyles';
import { brandPrimaryHighlightHover } from 'theme/hoverStyles';

const {
  fonts: { libreFranklin },
  keyedPalette: {
    alto,
    aquaSpring,
    brandPrimary,
    elm,
    lightBlack,
    mineShaft,
    pelorousapprox,
    silver,
    white,
  },
  transparency: { white70 },
} = base;

const borderColour = pelorousapprox;
const activeNavItemIconColor = elm;
const disabledNavItemIconColor = silver;

export { brandPrimary, activeNavItemIconColor, disabledNavItemIconColor };

export const AdminModelNav = styled(Col)`
  width: 164px;
  label: admin-model-nav;
`;

const activeNavItem = css`
  color: ${mineShaft};
  background: ${aquaSpring};
  border: solid 1px ${borderColour};
  border-left-width: 3px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.08);
  /* Extending it over 1 pixel to match design (cover other border) */
  z-index: 2;
  position: relative;
  width: 165px;
  label: admin-model-nav-item-active;
  padding-left: 8px;

  &:hover {
    color: ${mineShaft};
  }

  /* Using pseudo-elements to create triangle that extends beyond div */
  &:before,
  &:after {
    content: '';
    position: absolute;
  }

  &:before {
    border-top: 21px solid transparent;
    border-bottom: 21px solid transparent;
    border-left: 13px solid ${borderColour};
    right: -14px;
    top: -1px;
  }

  &:after {
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 12px solid ${aquaSpring};
    right: -12px;
    top: 0px;
  }
`;

const disabledNavItem = css`
  color: ${disabledNavItemIconColor};
  cursor: not-allowed;
  label: admin-model-nav-item-disabled;
`;

export const NavItem = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 10px;
  font-family: ${libreFranklin};
  font-size: 15px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  cursor: pointer;
  label: admin-model-nav-item;
  border: solid 1px ${alto};
  background-color: ${white};
  ${brandPrimaryHighlightHover};
  ${({ active }) => active && activeNavItem};
  ${({ disabled }) => disabled && disabledNavItem};
`;

export const navItemIcon = css`
  width: 24px;
  height: 24px;
  margin-right: 9px;
  fill: ${brandPrimary};
  label: admin-model-nav-item-icon;
`;

export const navItemIconActive = css`
  ${navItemIcon};
  fill: ${activeNavItemIconColor};
  label: admin-model-nav-item-icon-active;
`;

export const AdminModelContent = styled(AdminContent)`
  display: flex;
  flex-direction: column;
  width: calc(100% - 164px);
  min-height: 416px;
  z-index: 1;
  padding: 7px 8px;
  label: admin-model-content;
`;

export const ModelHeaderH1 = styled(AdminHeaderH1)`
  margin-right: 18px;
  label: admin-model-header-h1;
`;

export const ModelHeaderBackLink = styled(Link)`
  ${brandPrimaryHighlightHover};
  font-family: ${libreFranklin};
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  text-decoration: none;
  text-transform: uppercase;
  label: admin-model-header-back-link;
`;

export const Loading = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${white70};
  z-index: 9999;
`;
