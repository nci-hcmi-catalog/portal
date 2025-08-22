import React, { useContext } from 'react';
import { modelStatus } from '@hcmi-portal/cms/src/helpers/modelStatus';

import { ButtonPill } from '../../../../theme/adminControlsStyles';
import PublishIcon from '../../../../icons/PublishIcon';

import { usePublishNotifications } from '../../Notifications';
import Tooltip from '../../ToolTip';
import withPublishConfirmModal from '../../PublishLinkedModelsModal/PublishLinkedModelsModal';

import { ModelSingleContext } from '../ModelSingleController';
import { publish } from './Publish';

const PublishModel = ({ close, ...props }) => {
  const {
    state: {
      form: { isReadyToPublish, values, errors },
      matchedModels,
    },
  } = useContext(ModelSingleContext);
  const { isPublishingModel, addPublishNotification, showErrorPublishNotification } =
    usePublishNotifications();
  const disabled = !isReadyToPublish || isPublishingModel(values.name);

  const publishForm = async (modelName) => {
    await publish(modelName)
      .then(async () => {
        await addPublishNotification(modelName);
      })
      .catch(async (error) => {
        const data = error.response ? error.response.data : error;
        showErrorPublishNotification(modelName, data);
      });
  };

  return (
    <Tooltip
      trigger={() =>
        withPublishConfirmModal({
          disabled,
          next: () => isReadyToPublish && publishForm(values.name),
          modelNames: matchedModels
            .filter((i) => i.status === modelStatus.unpublishedChanges)
            .map((i) => i.name),
        })(
          <div>
            <ButtonPill primary disabled={disabled} {...props}>
              <PublishIcon />
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
};

export default PublishModel;
