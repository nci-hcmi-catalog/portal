import React from 'react';

import {
  BulkUploadContent,
  BulkUploadContentBlock,
  BulkUploadTemplateLink,
  GoogleSheetsUpload,
  GoogleSheetsLogo,
  UploadContentHeading,
  UploadOverwrite,
  OverwriteWarning,
} from 'theme/adminBulkUploadStyles';
import { Input, RadioSelect } from 'theme/formComponentsStyles';

import ErrorIcon from 'icons/ErrorIcon';
import ExportIcon from 'icons/ExportIcon';
import googleSheetsLogo from 'assets/logo-googlesheets.png';
import config from '../config';
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

export default ({
  type,
  onSheetsURLChange,
  sheetsURL,
  backupURL,
  overwrite,
  onOverwriteChange,
}) => (
  <BulkUploadContent>
    <BulkUploadContentBlock>
      <div>{`Submit your ${type} data by uploading a google sheet.`}</div>
      <BulkUploadTemplateLink href={`${config.urls.cmsBase}/templates/${type}s`}>
        <ExportIcon width={10} height={12} css={'margin: 0 5px 0 2px'} />Download Sheet Template
      </BulkUploadTemplateLink>
    </BulkUploadContentBlock>
    <BulkUploadContentBlock>
      <GoogleSheetsUpload>
        <h3>Google Sheets URL :</h3>
        <Input
          type="text"
          placeholder="Google Sheets URL"
          value={sheetsURL}
          onChange={({ target: { value } }) => onSheetsURLChange(value)}
        />
      </GoogleSheetsUpload>
      <GoogleSheetsLogo src={googleSheetsLogo} alt="google sheets logo" />
    </BulkUploadContentBlock>
    <BulkUploadContentBlock>
      <UploadOverwrite>
        <UploadContentHeading>
          {`Would you like to overwrite the existing ${type}s with the data from this google sheet?`}
        </UploadContentHeading>
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
                  onClick={e => {
                    onOverwriteChange(e.currentTarget.value);
                  }}
                />
                <span />
              </label>
            );
          })}
          {normalizeOption(overwrite) && (
            <OverwriteWarning>
              <ErrorIcon width={24} height={20} css={'margin-right: 10px;'} fill={'#f3ae4c'} />
              <div>
                It is recommend that you{' '}
                <a href={backupURL}>
                  <ExportIcon width={10} height={12} css={'margin: 0 5px 0 2px'} />download a backup
                </a>{' '}
                {`of the current ${type}s before overwriting data.`}
              </div>
            </OverwriteWarning>
          )}
        </RadioSelect>
      </UploadOverwrite>
    </BulkUploadContentBlock>
  </BulkUploadContent>
);
