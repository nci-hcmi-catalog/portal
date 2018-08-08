import React from 'react';
import { ModelSingleContext } from './ModelSingleController';

import { AdminFooter, AdminFooterBlock } from 'theme/adminStyles';
import { Pill } from 'theme/adminControlsStyles';

export default () => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        data: { response, error },
      },
    }) => (
      <AdminFooter>
        <AdminFooterBlock>
          <Pill secondary>Cancel</Pill>
        </AdminFooterBlock>
        <AdminFooterBlock>
          <Pill marginRight="10px" disabled>
            Publish
          </Pill>
          <Pill primary disabled>
            Save
          </Pill>
        </AdminFooterBlock>
      </AdminFooter>
    )}
  </ModelSingleContext.Consumer>
);
