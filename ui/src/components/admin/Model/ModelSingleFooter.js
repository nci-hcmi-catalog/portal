import React from 'react';
import { ModelSingleContext } from './ModelSingleController';

import { AdminFooter, AdminFooterBlock } from 'theme/adminStyles';
import { Pill } from 'theme/adminControlsStyles';

export default () => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { isReadyToSave, isReadyToPublish },
      },
    }) => (
      <AdminFooter>
        <AdminFooterBlock>
          <Pill secondary>Cancel</Pill>
        </AdminFooterBlock>
        <AdminFooterBlock>
          <Pill marginRight="10px" disabled={!isReadyToPublish}>
            Publish
          </Pill>
          <Pill primary disabled={!isReadyToSave}>
            Save
          </Pill>
        </AdminFooterBlock>
      </AdminFooter>
    )}
  </ModelSingleContext.Consumer>
);
