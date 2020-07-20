import React from 'react';
import styled from 'react-emotion';
import { css } from 'emotion';

import CrossIcon from 'icons/CrossIcon';

import base from 'theme';
import { Row } from 'theme/system';

const {
  fonts: { openSans },
  keyedPalette: { black, white, ironApprox, trout },
} = base;

export const AdminModalStyle = css`
  display: flex;
  position: absolute;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  max-width: 768px;
  border-radius: 10px;
  background-color: ${white};
  box-shadow: 0 8px 21px 0 rgba(0, 0, 0, 0.1), 0 6px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  label: admin-modal-main;
`;

export const AdminModalStyleNarrow = css`
  ${AdminModalStyle};
  max-width: 468px;
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
  padding: 0px 30px;
  label: admin-modal-header;
`;

export const Title = styled('h1')`
  width: 100%;
  padding: 26px 0 0;
  margin: 0;
  text-transform: capitalize;
  font-family: ${openSans};
  font-size: 20px;
  line-height: normal;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${black};
  label: admin-modal-title;
`;

const closeStyles = css`
  position: absolute;
  top: 16px;
  right: 16px;
  margin: 0;
  cursor: pointer;
`;

export const CloseModal = props => <CrossIcon fill={trout} style={closeStyles} {...props} />;

export const Content = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 25px 30px;
  font-family: ${openSans};
  font-size: 14px;
  line-height: 1.71;
  label: admin-modal-content;
`;

export const Footer = styled(Row)`
  justify-content: flex-end;
  padding: 8px 0;
  margin: 0 30px;
  border-top: 1px solid ${ironApprox};
  label: admin-modal-footer;
`;
