import React from 'react';

import { Pill } from 'theme/adminControlsStyles';
import { Footer } from 'theme/adminModalStyles';

const UploadInputControls = ({ onUploadClick, modalState }) => (
  <Footer>
    <Pill secondary onClick={() => modalState.setModalState({ component: null })}>Cancel</Pill>
    <Pill primary onClick={onUploadClick}>
      Upload
    </Pill>
  </Footer>
);
const UploadPublishControls = () => (
  <Footer>
    <Pill secondary>Back</Pill>
    <div
      css={`
        justify-content: flex-end;
        align-items: center;
        display: inherit;
      `}
    >
      <Pill primary>Save</Pill>
      <Pill>Save and publish</Pill>
    </div>
  </Footer>
);

export default ({ controlSet, ...props }) =>
  controlSet === 1 ? <UploadPublishControls {...props} /> : <UploadInputControls {...props} />;
