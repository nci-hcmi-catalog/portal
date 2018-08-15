import React from 'react';
import { ModelSingleContext } from '../ModelSingleController';
import { Pill } from 'theme/adminControlsStyles';
import AdminModelPublishIcon from 'icons/AdminModelPublishIcon';

export default props => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { isReadyToPublish, values },
      },
    }) => (
      <Pill disabled={!isReadyToPublish} {...props}>
        <AdminModelPublishIcon css={'margin-right: 10px;'} height={16} width={15} />Publish
      </Pill>
    )}
  </ModelSingleContext.Consumer>
);
