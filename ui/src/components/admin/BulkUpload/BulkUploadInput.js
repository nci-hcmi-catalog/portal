import React from 'react';
import TextInput from '@arranger/components/dist/Input';

import AdminDownloadIconRed from 'icons/AdminDownloadIconRed';
import googleSheetsLogo from 'assets/logo-googlesheets.png';

import { Row, Col } from 'theme/system';
import { Pill } from 'theme/adminControlsStyles';

export default ({ type, onSheetsURLChange, sheetsURL }) => (
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
      <Pill secondary>
        <AdminDownloadIconRed width={10} height={12} /> Download Template
      </Pill>
    </Row>
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
  </>
);
