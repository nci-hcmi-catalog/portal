import styled from '@emotion/styled';
import base from 'theme';
import { Row, Col } from 'theme/system';

const {
  fonts: { openSans },
  keyedPalette: { black, porcelain, white },
} = base;

const bkgColour = white;
const borderColour = porcelain;

export const AdminWrapper = styled(Col)`
  flex: 1 0 auto;
`;

export const AdminMain = styled(Row)`
  background: ${bkgColour};
  label: admin-main;
`.withComponent('main');

export const AdminContainer = styled(Col)`
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ p }) => p || '0 20px'};
  label: admin-container;
`;

export const AdminHeader = styled(Row)`
  width: 100%;
  padding: 32px 0 20px;
  justify-content: space-between;
  align-items: center;
  label: admin-header;
`;

export const AdminFooter = styled(AdminHeader)`
  width: calc(100% - 164px);
  align-self: flex-end;
  padding: 22px 0 25px;
  label: admin-footer;
`;

export const AdminHeaderH1 = styled('h1')`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: ${openSans};
  line-height: 1.15;
  color: ${black};
  font-size: 26px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  margin: 0;
  label: admin-header-h1;
`;

export const AdminHeaderH3 = styled('h3')`
  font-family: ${openSans};
  line-height: 1.71;
  color: ${black};
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  margin: 0;
  label: admin-header-h3;
`;

export const AdminHeaderBlock = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  label: admin-header-block;
`;

export const AdminFooterBlock = styled(AdminHeaderBlock)`
  label: admin-footer-block;
`;

export const AdminContent = styled(Row)`
  width: 100%;
  padding: 8px;
  background: ${white};
  border: solid 1px ${borderColour};
  label: admin-content;
`;
