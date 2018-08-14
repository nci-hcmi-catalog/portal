import React from 'react';
import { Row, Col } from 'theme/system';
import { css } from 'emotion';
import styled from 'react-emotion';
import AdminModalClose from 'icons/AdminModalCloseIcon';
import base from 'theme';

const {
  fonts: { libreFranklin },
  keyedPalette: { brandPrimary, lightPorcelain, porcelain, white, frenchGrey },
} = base;

export const BulkUploadMain = styled(Col)`
  label: bulk-upload-main;
`;

export const BulkUploadHeader = styled(Row)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  label: bulk-upload-header;
`;

export const CloseModal = props => <AdminModalClose width={24} height={34} {...props} />;

export const BulkUploadTitle = styled('span')`
  display: inherit;
  text-transform: capitalize;
  font-family: ${libreFranklin};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${brandPrimary};
  label: bulk-upload-title;
`;

export const HeaderSeparator = styled('div')`
  display: inline-block;
  width: 98%;
  height: 1px;
  border: solid 1px ${frenchGrey};
  label: bulk-upload-separator;
`;

export const BulkUploadContent = styled(Col)`
  width: 100%;
  label: bulk-upload-content;
`;
