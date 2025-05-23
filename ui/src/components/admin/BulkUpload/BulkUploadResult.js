import React from 'react';
import { css } from '@emotion/react';
import { Row, Col } from 'theme/system';
import { BulkUploadSubTitle } from 'theme/adminBulkUploadStyles';

const bulkUploadResult = ({ type, displayType, uploadResults }) => {
  //TODO: handle other error types
  const {
    data: { docs, error },
  } = uploadResults || {
    data: {},
  };

  return (
    <>
      <Row alignItems="center" justifyContent="space-between">
        <div
          css={css`
            flex-grow: 1;
            width: fit-content;
          `}
        >
          {`Your ${
            displayType || type
          }s have been checked for required fields and all submitted fields were validated against permissible values.`}
        </div>
      </Row>
      <BulkUploadSubTitle> Upload Summary </BulkUploadSubTitle>
      <Col>
        {docs ? (
          <div
            css={css`
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
            css={css`
              color: red;
            `}
          >
            Some models had errors while importing. Please fix those errors in your sheet and
            re-upload.
          </div>
        ) : (
          ''
        )}
      </Col>
    </>
  );
};

export default bulkUploadResult;
