import React from 'react';
import styled from 'react-emotion';
import { css } from 'emotion';

import AdminModalClose from 'icons/AdminModalCloseIcon';

import base from 'theme';
import { Row } from 'theme/system';

const {
  fonts: { libreFranklin },
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
  label: bulk-upload-modal-main;
`;

export const ModalWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow: hidden;
  label: upload-modal-wrapper;
`;

export const Header = styled(Row)`
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 0px 21px;
  label: upload-modal-header;
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
  label: upload-modal-title;
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
  label: bulk-upload-content;
`;

export const Footer = styled(Row)`
  justify-content: space-between;
  background: ${lightPorcelain};
  padding: 8px 21px;
  label: upload-modal-footer;
`;
