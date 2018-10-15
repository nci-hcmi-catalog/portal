import React from 'react';

import { HoverPill } from 'theme/adminControlsStyles';
import { Footer } from 'theme/adminModalStyles';

export default ({ onUploadClick, modalState }) => (
  <Footer>
    <HoverPill secondary onClick={() => modalState.setModalState({ component: null })}>
      Cancel
    </HoverPill>
    <HoverPill primary onClick={onUploadClick}>
      Upload
    </HoverPill>
  </Footer>
);
