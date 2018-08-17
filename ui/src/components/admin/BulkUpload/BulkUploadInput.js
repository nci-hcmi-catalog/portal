import React from 'react';
import { Row, Col } from 'theme/system';
import { Pill } from 'theme/adminNavStyles';
import AdminDownloadIconRed from 'icons/AdminDownloadIconRed';
import googleSheetsLogo from 'assets/logo-googlesheets.png';
import TextInput from '@arranger/components/dist/Input';
import { SectionDivider } from 'theme/adminBulkUploadStyles';

export default ({ type, onSheetsURLChange, sheetsURL, ...props }) => (
  <>
    <Row alignItems="center" justifyContent="space-between">
      <div
        css={`
          flex-grow: 1;
          width: fit-content;
        `}
      >
        {`Submit your ${type} data by uploading a google sheet or a CSV file`}
      </div>
      <Pill
        css={`
          flex-grow: 1;
          width: min-content;
        `}
      >
        <AdminDownloadIconRed width={10} height={12} /> Download Template
      </Pill>
    </Row>
    <SectionDivider
      css={`
        padding-top: 3px;
        padding-bottom: 3px;
        border: none;
      `}
    />
    <Row alignItems="center" justifyContent="left">
      <img
        src={googleSheetsLogo}
        alt="google sheets url"
        css={`
          height: 90px;
          flex-grow: 0;
        `}
      />
      <Col
        css={`
          flex-grow: 1;
        `}
      >
        <div> Google Sheets URL : </div>
        <TextInput
          css={`
            width: 100%;
          `}
          type="text"
          placeholder="Google Sheets URL"
          value={sheetsURL}
          onChange={({ target: { value } }) => onSheetsURLChange(value)}
        />
      </Col>
    </Row>
    <SectionDivider
      css={`
        padding-top: 3px;
        padding-bottom: 3px;
        border: none;
      `}
    />
  </>
);
