import { AdminFooter, AdminFooterBlock } from '~/theme/adminStyles';
import { LinkPill } from '~/theme/adminControlsStyles';

import { manageModelsUrlBase } from '../AdminNav';

import { SaveModel, PublishModel } from './actions';

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
