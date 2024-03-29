import React from 'react';
import { manageModelsUrlBase } from '../AdminNav';

import { SaveModel, PublishModel } from './actions';

import { AdminFooter, AdminFooterBlock } from 'theme/adminStyles';
import { LinkPill } from 'theme/adminControlsStyles';

const ModelSingleFooter = () => (
  <AdminFooter>
    <AdminFooterBlock>
      <LinkPill to={manageModelsUrlBase} secondary={`true`}>
        Cancel
      </LinkPill>
    </AdminFooterBlock>
    <AdminFooterBlock>
      <PublishModel marginRight="10px" />
      <SaveModel />
    </AdminFooterBlock>
  </AdminFooter>
);

export default ModelSingleFooter;
