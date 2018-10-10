import React from 'react';
import { Row, Col } from 'theme/system';
import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';
import { brandPrimaryHighlightHover } from 'theme/hoverStyles';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: {
    brandPrimary,
    lightPorcelain,
    porcelain,
    white,
    black,
    dustyGray,
    mineShaft,
    oldLace,
    casablanca,
  },
} = base;

export const BulkUploadSubTitle = styled('div')`
  display: inherit;
  text-transform: capitalize;
  font-family: ${libreFranklin};
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  padding-top: 5px;
  padding-bottom: 5px;
  color: ${brandPrimary};
  label: bulk-upload-title;
`;

const bulkUploadContentCommon = css`
  width: 98%;
`;

export const SequentialTabsHeader = styled(Row)`
  ${bulkUploadContentCommon};
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

export const BulkUploadContent = styled('div')`
  display: flex;
  flex-direction: column;
  font-family: ${openSans};
  font-size: 16px;
  color: ${mineShaft};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: left;
  label: bulk-upload-content;
`;

export const BulkUploadContentBlock = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 36px;
  label: bulk-upload-content-block;

  &:last-child {
    margin: 0;
  }
`;

export const BulkUploadTemplateLink = styled('a')`
  margin-left: auto;
  font-family: ${libreFranklin};
  font-size: 12px;
  font-weight: 500;
  color: ${brandPrimary};
  text-decoration: none;
  text-transform: uppercase;
  label: bulk-upload-template-link;
`;

export const GoogleSheetsUpload = styled('div')`
  display: flex;
  flex-direction: column;
  color: ${black};
  width: calc(100% - 80px);
  label: google-sheets-upload;

  h3 {
    font-family: ${libreFranklin};
    font-size: 13px;
    line-height: 13px;
    font-weight: 500;
    text-transform: uppercase;
    margin: 0 0 10px;
  }

  input {
    font-family: ${openSans};
    font-size: 14px;
    font-weight: normal;
  }
`;

export const GoogleSheetsLogo = styled('img')`
  display: block;
  height: 59px;
  margin-left: auto;
  label: google-sheets-logo;
`;

export const UploadContentHeading = styled('h3')`
  font-family: ${openSans};
  font-size: 16px;
  line-height: 16px;
  font-weight: 600;
  line-height: 1.75;
  letter-spacing: normal;
  color: ${mineShaft};
  margin: 0 0 16px;
  label: bulk-upoad-content-heading;
`;

export const UploadOverwrite = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;

  fieldset {
    border: 0;
    padding: 0;
  }
`;

export const OverwriteWarning = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px;
  border-radius: 5px;
  background-color: ${oldLace};
  border: solid 2px ${casablanca};
  color: ${mineShaft};
  font-family: ${openSans};
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.86;
  letter-spacing: normal;
  margin-top: 20px;

  a {
    font-weight: bold;
    ${brandPrimaryHighlightHover};
  }
`;
