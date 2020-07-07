import React from 'react';

import { HoverPill } from 'theme/adminControlsStyles';
import { Footer } from 'theme/adminModalStyles';

export default ({ onUploadClick, modalState }) => (
  <Footer
    css={`
      margin-bottom: 12px;
    `}
  >
    <HoverPill primary marginRight={`10px`} onClick={onUploadClick}>
      Upload
    </HoverPill>
    <HoverPill secondary onClick={() => modalState.setModalState({ component: null })}>
      Cancel
    </HoverPill>
  </Footer>
);
