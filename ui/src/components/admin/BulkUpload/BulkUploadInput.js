import React from 'react';
import TextInput from '@arranger/components/dist/Input';
import googleSheetsLogo from 'assets/logo-googlesheets.png';

import { Row, Col } from 'theme/system';
import { RadioSelect } from 'theme/formComponentsStyles';

const normalizeOption = option => (option === 'true' ? true : option === 'false' ? false : option);

// Map simple string/number options to keyed objects
const processOptions = options =>
  options.map(
    option =>
      typeof option === 'object' && option.constructor === Object
        ? option
        : { label: option, value: normalizeOption(option) },
  );

const overwriteOptions = type => [
  { label: `No, do not overwrite existing ${type}s`, value: false },
  { label: `Yes, overwrite existing ${type}s`, value: true },
];

export default ({ type, onSheetsURLChange, sheetsURL, overwrite, onOverwriteChange }) => (
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
      <a href="https://sheets.google.com">SHEET TEMPLATE</a>
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
    <Row alignItems="center" justifyContent="space-between">
      <div
        css={`
          flex-grow: 1;
          width: fit-content;
        `}
      >
        <bold
        >{`Would you like to overwrite the existing ${type}s with the data from this google sheet?`}</bold>
        <RadioSelect>
          {processOptions(overwriteOptions(type)).map((option, idx) => {
            let formValue = normalizeOption(overwrite);
            const optionValue = normalizeOption(option.value);
            return (
              <label key={idx}>
                {option.label}
                <input
                  type="radio"
                  value={optionValue}
                  checked={formValue === optionValue}
                  onChange={e => {
                    onOverwriteChange(e.currentTarget.value);
                  }}
                  onclick={e => {
                    onOverwriteChange(e.currentTarget.value);
                  }}
                />
                <span />
              </label>
            );
          })}
        </RadioSelect>
      </div>
    </Row>
  </>
);
