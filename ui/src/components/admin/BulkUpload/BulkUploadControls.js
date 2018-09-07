import React from 'react';

import { Pill } from 'theme/adminControlsStyles';
import { Footer } from 'theme/adminModalStyles';

export default ({ onUploadClick, modalState }) => (
  <Footer>
    <Pill secondary onClick={() => modalState.setModalState({ component: null })}>
      Cancel
    </Pill>
    <Pill primary onClick={onUploadClick}>
      Upload
    </Pill>
  </Footer>
);
