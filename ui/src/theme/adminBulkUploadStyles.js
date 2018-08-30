import React from 'react';
import { Row, Col } from 'theme/system';
import { css } from 'emotion';
import styled from 'react-emotion';
import base from 'theme';

const {
  fonts: { libreFranklin, openSans },
  keyedPalette: { brandPrimary, lightPorcelain, porcelain, white, black, dustyGray },
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
