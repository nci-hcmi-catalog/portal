import React from 'react';
import Tooltip from '../../ToolTip';

import { ModelSingleContext } from '../ModelSingleController';

import { HoverPill } from 'theme/adminControlsStyles';
import AdminModelPublishIcon from 'icons/AdminModelPublishIcon';

export default props => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { isReadyToPublish, values, errors },
      },
      publishForm,
    }) => (
      <Tooltip
        trigger={() => (
          <HoverPill
            disabled={!isReadyToPublish}
            onClick={() => isReadyToPublish && publishForm(values)}
            {...props}
          >
            <AdminModelPublishIcon css={'margin-right: 10px;'} height={16} width={15} />Publish
          </HoverPill>
        )}
        disabled={isReadyToPublish}
      >
        {Object.keys(errors).length > 0 || !values.name
          ? 'Please complete all required fields before publishing'
          : !isReadyToPublish
            ? 'No new changes to publish'
            : // If a user hovers for 1000 seconds ...
              'Ready to Publish =)'}
      </Tooltip>
    )}
  </ModelSingleContext.Consumer>
);
