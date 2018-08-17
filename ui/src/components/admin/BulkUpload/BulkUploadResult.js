import React from 'react';
import { Row, Col } from 'theme/system';
import { SectionDivider, BulkUploadSubTitle } from 'theme/adminBulkUploadStyles';

const getSuccessCounts = results => results;

export default ({ type, uploadResults, ...props }) => {
  //TODO: handle other error types
  const {
    data: { docs, error },
  } = uploadResults || {
    data: {},
  };

  return (
    <>
      {' '}
      <Row alignItems="center" justifyContent="space-between">
        {' '}
        <div
          css={`
            flex-grow: 1;
            width: fit-content;
          `}
        >
          {' '}
          {`Your ${type}s have been checked for required fields and all submitted fields were validated against permissible values.`}{' '}
        </div>
      </Row>{' '}
      <SectionDivider
        css={`
          padding-top: 3px;
          padding-bottom: 3px;
          border: none;
        `}
      />{' '}
      <BulkUploadSubTitle> Upload Summary </BulkUploadSubTitle>{' '}
      <SectionDivider
        css={`
          padding-top: 3px;
          padding-bottom: 3px;
          border: none;
        `}
      />{' '}
      <Col>
        {' '}
        {docs ? (
          <div
            css={`
              color: green;
              font-weight: bold;
            `}
          >
            Data Import successful.
          </div>
        ) : (
          ''
        )}
        {error ? (
          <div
            css={`
              color: red;
            `}
          >
            Some models had errors while importing. Please fix those errors in your sheet and
            re-upload.
          </div>
        ) : (
          ''
        )}{' '}
      </Col>{' '}
    </>
  );
};
