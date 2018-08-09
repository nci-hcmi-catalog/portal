import React from 'react';
import { ModelSingleContext } from './ModelSingleController';
import { manageModelsUrlBase } from '../AdminNav';

import AdminModelPublishIcon from 'icons/AdminModelPublishIcon';
import AdminModelSaveIcon from 'icons/AdminModelSaveIcon';

import { AdminFooter, AdminFooterBlock } from 'theme/adminStyles';
import { Pill, LinkPill } from 'theme/adminControlsStyles';

export default () => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { isReadyToSave, isReadyToPublish },
      },
    }) => (
      <AdminFooter>
        <AdminFooterBlock>
          <LinkPill to={manageModelsUrlBase} secondary>
            Cancel
          </LinkPill>
        </AdminFooterBlock>
        <AdminFooterBlock>
          <Pill marginRight="10px" disabled={!isReadyToPublish}>
            <AdminModelPublishIcon css={'margin-right: 10px;'} height={16} width={15} />Publish
          </Pill>
          <Pill primary disabled={!isReadyToSave}>
            <AdminModelSaveIcon css={'margin-right: 8px;'} height={14} width={14} />Save
          </Pill>
        </AdminFooterBlock>
      </AdminFooter>
    )}
  </ModelSingleContext.Consumer>
);
