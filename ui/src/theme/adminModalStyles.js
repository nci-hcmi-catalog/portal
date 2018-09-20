import React from 'react';
import styled from 'react-emotion';
import { css } from 'emotion';

import AdminModalClose from 'icons/AdminModalCloseIcon';

import base from 'theme';
import { Row } from 'theme/system';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: { brandPrimary, lightPorcelain, white, frenchGrey },
} = base;

export const AdminModalStyle = css`
  display: flex;
  position: absolute;
  flex-direction: column;
  top: 25%;
  left: 25%;
  right: auto;
  bottom: auto;
  width: 95%;
  max-width: 824px;
  border-radius: 5px;
  background-color: ${white};
  label: admin-modal-main;
`;

export const AdminModalStyleNarrow = css`
  ${AdminModalStyle};
  max-width: 468px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const ModalWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  label: admin-modal-wrapper;
`;

export const Header = styled(Row)`
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 0px 21px;
  label: admin-modal-header;
`;

export const Title = styled('h1')`
  width: 100%;
  padding: 24px 45px 18px 0;
  margin: 0;
  border-bottom: 1px solid ${frenchGrey};
  text-transform: capitalize;
  font-family: ${libreFranklin};
  font-size: 20px;
  line-height: 20px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${brandPrimary};
  label: admin-modal-title;
`;

const closeStyles = css`
  position: absolute;
  top: 18px;
  right: 20px;
  margin: 0;
`;

export const CloseModal = props => (
  <AdminModalClose width={24} height={34} style={closeStyles} {...props} />
);

export const Content = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 30px 21px;
  font-family: ${openSans};
  label: admin-modal-content;
`;

export const Footer = styled(Row)`
  justify-content: space-between;
  background: ${lightPorcelain};
  padding: 8px 21px;
  label: admin-modal-footer;
`;
