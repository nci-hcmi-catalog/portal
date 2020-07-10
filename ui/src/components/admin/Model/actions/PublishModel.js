import React from 'react';
import Tooltip from '../../ToolTip';

import { ModelSingleContext } from '../ModelSingleController';

import { ButtonPill } from 'theme/adminControlsStyles';

import withPublishConfirmModal from '../../PublishLinkedModelsModal/PublishLinkedModelsModal';

import { modelStatus } from '@hcmi-portal/cms/src/helpers/modelStatus';

export default ({ close, ...props }) => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { isReadyToPublish, values, errors },
        matchedModels,
      },
      publishForm,
    }) => {
      const disabled = !isReadyToPublish;
      return (
        <Tooltip
          trigger={() =>
            withPublishConfirmModal({
              disabled,
              next: () => isReadyToPublish && publishForm(values),
              modelNames: matchedModels
                .filter(i => i.status === modelStatus.unpublishedChanges)
                .map(i => i.name),
            })(
              <div>
                <ButtonPill primary disabled={disabled} {...props}>
                  Publish
                </ButtonPill>
              </div>,
            )
          }
          disabled={isReadyToPublish}
        >
          {Object.keys(errors).length > 0 || !values.name
            ? 'Please complete all required fields before publishing'
            : !isReadyToPublish
            ? 'No new changes to publish'
            : // If a user hovers for 1000 seconds ...
              'Ready to Publish =)'}
        </Tooltip>
      );
    }}
  </ModelSingleContext.Consumer>
);
