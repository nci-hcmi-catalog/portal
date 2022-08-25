import React, { useState } from 'react';
import { css } from '@emotion/react';
import Spinner from 'react-spinkit';
import Popup from 'reactjs-popup';

import {
  BulkUploadContent,
  BulkUploadContentBlock,
  BulkUploadTemplateLink,
  BulkUploadTemplateLinkDisabled,
  GoogleSheetsUpload,
  GoogleSheetsLogo,
  UploadContentHeading,
  UploadOverwrite,
  OverwriteWarning,
} from 'theme/adminBulkUploadStyles';
import { Input, RadioSelect } from 'theme/formComponentsStyles';
import { getUploadTemplate } from '../helpers/googleSheets';

import ErrorTriangleIcon from 'icons/ErrorTriangleIcon';
import ExportIcon from 'icons/ExportIcon';
import ExternalLinkIcon from 'icons/ExternalLinkIcon';
import googleSheetsLogo from 'assets/logo-googlesheets.png';

import { BULK_UPLOAD_TYPES, VARIANT_OVERWRITE_OPTIONS } from 'utils/constants';

const normalizeOption = (option) =>
  option === 'true' ? true : option === 'false' ? false : option;

// Map simple string/number options to keyed objects
const processOptions = (options) =>
  options.map((option) =>
    typeof option === 'object' && option.constructor === Object
      ? option
      : { label: option, value: normalizeOption(option) },
  );

const overwriteOptions = (type) => [
  { label: `No, do not overwrite existing ${type}s`, value: false },
  { label: `Yes, overwrite existing ${type}s`, value: true },
];

const variantOverwriteOptions = [
  {
    label: 'Yes, but only for models with no research somatic variant data.',
    value: VARIANT_OVERWRITE_OPTIONS.cleanOnly,
  },
  { label: 'Yes, for all models in this sheet.', value: VARIANT_OVERWRITE_OPTIONS.allModels },
  {
    label: 'No, do not import any research somatic variant data.',
    value: VARIANT_OVERWRITE_OPTIONS.none,
  },
];

const BulkUploadInput = ({
  type,
  displayType,
  onSheetsURLChange,
  sheetsURL,
  backupURL,
  overwrite,
  overwriteVariants,
  onOverwriteChange,
  onOverwriteVariantsChange,
  signedIn,
}) => {
  const [templateUrl, setTemplateUrl] = useState(null);
  const [generating, setGenerating] = useState(false);

  const renderTemplateLink = (templateUrl) => {
    return generating ? (
      // Spinner while generating
      <BulkUploadTemplateLink>
        <Spinner fadeIn="none" name="circle" color="#a9adc0" style={{ width: 15, height: 15 }} />
      </BulkUploadTemplateLink>
    ) : templateUrl ? (
      // URL to sheet once generated
      <BulkUploadTemplateLink href={templateUrl} target="_blank">
        <ExternalLinkIcon height={'10px'} width={'10px'} />
        Bulk Upload Template
      </BulkUploadTemplateLink>
    ) : (
      // Prompt to generate sheet for default state
      <BulkUploadTemplateLink
        onClick={async () => {
          setGenerating(true);
          const response = await getUploadTemplate(type);
          setGenerating(false);
          if (response.url) {
            setTemplateUrl(response.url);
          }
        }}
      >
        Generate New Bulk Upload Template
      </BulkUploadTemplateLink>
    );
  };

  return (
    <BulkUploadContent>
      <BulkUploadContentBlock>
        <div>{`Submit your ${displayType || type} data by uploading a google sheet.`}</div>
        {signedIn ? (
          renderTemplateLink(templateUrl)
        ) : (
          <BulkUploadTemplateLinkDisabled>
            <Popup arrow={false} trigger={() => <div>Generate New Bulk Upload Template</div>}>
              Connect to Google to enable generating template sheets.
            </Popup>
          </BulkUploadTemplateLinkDisabled>
        )}
      </BulkUploadContentBlock>
      <BulkUploadContentBlock>
        <GoogleSheetsUpload>
          <h3>Google Sheets URL :</h3>
          <Input
            type="text"
            placeholder="Google Sheets URL"
            aria-label={`Google Sheets URL`}
            value={sheetsURL}
            onChange={({ target: { value } }) => onSheetsURLChange(value)}
          />
        </GoogleSheetsUpload>
        <GoogleSheetsLogo src={googleSheetsLogo} alt="google sheets logo" />
      </BulkUploadContentBlock>
      <BulkUploadContentBlock>
        <UploadOverwrite>
          <UploadContentHeading>
            {`Would you like to overwrite the existing ${
              displayType || type
            }s with the data from this google sheet?`}
          </UploadContentHeading>
          <RadioSelect>
            {processOptions(overwriteOptions(type)).map((option, idx) => {
              let formValue = normalizeOption(overwrite);
              const optionValue = normalizeOption(option.value);
              return (
                <label key={idx} htmlFor={`overwrite-option-${idx}`}>
                  {option.label}
                  <input
                    type="radio"
                    id={`overwrite-option-${idx}`}
                    value={optionValue}
                    checked={formValue === optionValue}
                    onChange={(e) => {
                      onOverwriteChange(e.currentTarget.value);
                    }}
                    onClick={(e) => {
                      onOverwriteChange(e.currentTarget.value);
                    }}
                  />
                  <span />
                </label>
              );
            })}
            {normalizeOption(overwrite) && (
              <OverwriteWarning>
                <ErrorTriangleIcon
                  width={'24px'}
                  height={'20px'}
                  css={css`
                    margin-right: 10px;
                  `}
                  fill={'#f3ae4c'}
                />
                <div>
                  It is recommend that you{' '}
                  <a href={backupURL}>
                    <ExportIcon
                      width={'10px'}
                      height={'12px'}
                      css={css`
                        margin: 0 5px 0 2px;
                      `}
                    />
                    download a backup
                  </a>{' '}
                  {`of the current ${displayType || type}s before overwriting data.`}
                </div>
              </OverwriteWarning>
            )}
          </RadioSelect>
        </UploadOverwrite>
      </BulkUploadContentBlock>
      {type === BULK_UPLOAD_TYPES.MODEL && (
        <BulkUploadContentBlock>
          <UploadOverwrite>
            <UploadContentHeading>
              {`Would you like to overwrite the existing research somatic variants for the ${
                displayType || type
              }s within this google sheet?`}
            </UploadContentHeading>
            <RadioSelect>
              {variantOverwriteOptions.map((option, idx) => {
                let formValue = normalizeOption(overwriteVariants);
                const optionValue = normalizeOption(option.value);
                return (
                  <label key={idx} htmlFor={`overwrite-variants-option-${idx}`}>
                    {option.label}
                    <input
                      type="radio"
                      id={`overwrite-variants-option-${idx}`}
                      value={optionValue}
                      checked={formValue === optionValue}
                      onChange={(e) => {
                        onOverwriteVariantsChange(e.currentTarget.value);
                      }}
                      onClick={(e) => {
                        onOverwriteVariantsChange(e.currentTarget.value);
                      }}
                    />
                    <span />
                  </label>
                );
              })}
            </RadioSelect>
          </UploadOverwrite>
        </BulkUploadContentBlock>
      )}
    </BulkUploadContent>
  );
};

export default BulkUploadInput;
