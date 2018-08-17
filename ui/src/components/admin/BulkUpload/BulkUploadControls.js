import React from 'react';
import { Row } from 'theme/system';
import { Pill } from 'theme/adminNavStyles';
import { css } from 'emotion';
import base from 'theme';
import { BulkUploadControlPill } from 'theme/adminBulkUploadStyles';

const {
  keyedPalette: { lightPorcelain },
} = base;

const commonControlStyles = css`
  background: ${lightPorcelain};
  width: 100%;
  justify-content: space-between;
  padding: 4px;
`;
const UploadInputControls = ({ onUploadClick }) => (
  <Row alignItems="center" justifyContent="space-between" css={commonControlStyles}>
    <Pill
      css={`
        display: inherit;
        flex-grow: 1;
        width: min-content;
        max-width: 90px;
      `}
    >
      Cancel
    </Pill>
    <BulkUploadControlPill
      css={`
        display: inherit;
        flex-grow: 1;
        width: min-content;
        max-width: 90px;
      `}
      onClick={onUploadClick}
    >
      Upload
    </BulkUploadControlPill>
  </Row>
);
const UploadPublishControls = props => (
  <Row alignItems="center" justifyContent="space-between" css={commonControlStyles}>
    <Pill
      css={`
        display: inherit;
        width: min-content;
        max-width: 90px;
      `}
    >
      Back
    </Pill>
    <div
      css={`
        justify-content: flex-end;
        align-items: center;
        display: inherit;
      `}
    >
      <BulkUploadControlPill
        css={`
          display: inherit;
          width: min-content;
        `}
      >
        Save
      </BulkUploadControlPill>
      <BulkUploadControlPill
        css={`
          display: inherit;
          width: max-content;
        `}
      >
        Save and publish
      </BulkUploadControlPill>
    </div>
  </Row>
);

export default ({ controlSet, ...props }) =>
  controlSet === 1 ? <UploadPublishControls {...props} /> : <UploadInputControls {...props} />;
