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
      publishForm,
    }) => (
      <Pill
        disabled={!isReadyToPublish}
        onClick={() => isReadyToPublish && publishForm(values)}
        {...props}
      >
        <AdminModelPublishIcon css={'margin-right: 10px;'} height={16} width={15} />Publish
      </Pill>
    )}
  </ModelSingleContext.Consumer>
);
