import styled from 'react-emotion';
import base from 'theme';
import { Col } from 'theme/system';
import { AdminContent } from 'theme/adminStyles';

const {
  fonts: { libreFranklin },
  keyedPalette: { brandPrimary },
} = base;

export const AdminModelNav = styled(Col)`
  width: 164px;
  label: admin-model-nav;
`;

export const NavItem = styled('div')`
  padding: 19px 15px;
  font-family: ${libreFranklin};
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.57;
  letter-spacing: normal;
  text-align: left;
  color: ${brandPrimary};
  text-transform: uppercase;
  label: admin-model-nav-item;
`;

export const AdminModelContent = styled(AdminContent)`
  width: calc(100% - 164px);
  label: admin-model-content;
`;
