import React from 'react';

import { ButtonPill } from 'theme/adminControlsStyles';
import { Footer } from 'theme/adminModalStyles';

export default ({ onUploadClick, modalState }) => (
  <Footer
    css={`
      margin-bottom: 12px;
    `}
  >
    <ButtonPill primary marginRight={`10px`} onClick={onUploadClick}>
      Upload
    </ButtonPill>
    <ButtonPill secondary onClick={() => modalState.setModalState({ component: null })}>
      Cancel
    </ButtonPill>
  </Footer>
);
