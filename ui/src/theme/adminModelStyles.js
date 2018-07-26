import styled from 'react-emotion';
import { Col } from 'theme/system';
import { AdminContent } from 'theme/adminStyles';

export const AdminModelNav = styled(Col)`
  width: 164px;
`;

export const NavItem = styled('div')`
  padding: 19px 15px;
`;

export const AdminModelContent = styled(AdminContent)`
  width: calc(100% - 164px);
`;
