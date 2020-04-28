import { css } from 'emotion';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import base from 'theme';
import { Col } from 'theme/system';
import { AdminContent, AdminHeaderH1 } from 'theme/adminStyles';
import { brandPrimaryHighlightHover } from 'theme/hoverStyles';

const {
  fonts: { libreFranklin },
  keyedPalette: { brandPrimary, elm, mineShaft, silver },
  transparency: { white70 },
} = base;

const activeNavItemIconColor = elm;
const disabledNavItemIconColor = silver;

export { brandPrimary, activeNavItemIconColor, disabledNavItemIconColor };

export const AdminModelNav = styled(Col)`
  width: 164px;
  label: admin-model-nav;
`;

export const navItemIcon = css`
  width: 24px;
  height: 24px;
  margin-right: 9px;
  fill: ${brandPrimary};
  label: admin-model-nav-item-icon;
`;

export const navItemActive = css`
  color: ${mineShaft};

  &:hover {
    color: ${mineShaft};
  }
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
