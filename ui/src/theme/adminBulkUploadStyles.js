import React from 'react';
import { Row, Col } from 'theme/system';
import { css } from 'emotion';
import styled from 'react-emotion';
import AdminModalClose from 'icons/AdminModalCloseIcon';
import base from 'theme';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: {
    brandPrimary,
    lightPorcelain,
    porcelain,
    white,
    frenchGrey,
    black,
    dustyGray,
    valencia,
  },
  buttons: { pillBase },
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

const bulkUploadContentCommon = css`
  width: 98%;
`;

export const SectionDivider = styled('div')`
  ${bulkUploadContentCommon};
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

export const SequentialTabsHeader = styled(Row)`
  ${bulkUploadContentCommon};
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: ${lightPorcelain};
  border: solid 1px ${porcelain};
  label: tabs-header-main;
`;

export const SequentialTabsContent = styled(Col)`
  ${bulkUploadContentCommon};
  label: tabs-content;
`;

const TabTitleCircle = styled('div')`
  width: 16px;
  height: 16px;
  background: ${dustyGray};
  border-radius: 8px;
  margin-left: 10px;
  background: ${props => props.active && brandPrimary};
  label: tab-title-circle;
`;

const TabTitleText = styled('span')`
  font-family: ${openSans};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  color: ${black};
  margin-left: 10px;
  ${props => props.active && activeTabTitleText};
  label: inactive-tab-title;
`;

const activeTabTitleText = css`
  font-weight: bold;
  color: ${brandPrimary};
  label: active-tab-title;
`;

const TabTitleMain = styled('div')`
  display: inherit;
  cursor: pointer;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 2px;
  flex-grow: 1;
  align-items: center;

  ${props => props.active && activeTabTitleMain};
  label: inactive-tab-titlemain;
`;

const activeTabTitleMain = css`
  background: ${white};
  label: active-tab-titlemain;
`;

export const SequentialTabTitle = ({ text, ...p }) => (
  <TabTitleMain {...p}>
    <TabTitleCircle {...p} />
    <TabTitleText {...p}>{text}</TabTitleText>
  </TabTitleMain>
);

export const BulkUploadModalStyle = css`
  top: 25%;
  left: 25%;
  right: auto;
  bottom: auto;
  width: 95%;
  max-width: 824px;
  padding-top: 10px;
  padding-left: 15px;
  padding-right: 10px;
  border-radius: 5px;
  display: flex;
  position: absolute;
  flex-direction: column;
  background-color: ${white};
  label: bulk-upload-modal-main;
`;

export const BulkUploadControlPill = styled('div')`
  ${pillBase};
  background-color: ${valencia};
  color: #ffffff;
  margin-left: auto;
  margin-left: ${props => props.last && '20px'};
  justify-content: flex-end;
  label: bulk-upload-control-pill;
`;
