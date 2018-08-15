import React from 'react';
import { manageModelsUrlBase } from '../AdminNav';

import { SaveModel, PublishModel } from './actions';

import { AdminFooter, AdminFooterBlock } from 'theme/adminStyles';
import { LinkPill } from 'theme/adminControlsStyles';

export default () => (
  <AdminFooter>
    <AdminFooterBlock>
      <LinkPill to={manageModelsUrlBase} secondary>
        Cancel
      </LinkPill>
    </AdminFooterBlock>
    <AdminFooterBlock>
      <PublishModel marginRight="10px" />
      <SaveModel />
    </AdminFooterBlock>
  </AdminFooter>
);
