import React, { useContext } from 'react';
import { ModelSingleContext } from '../ModelSingleController';
import { usePublishNotifications } from 'components/admin/Notifications';
import { ButtonPill } from 'theme/adminControlsStyles';
import SaveIcon from 'icons/SaveIcon';

const SaveModel = (props) => {
  const {
    state: {
      form: { values, isReadyToSave },
      ui: { activeTab },
    },
    saveForm,
  } = useContext(ModelSingleContext);
  const { isPublishingModel } = usePublishNotifications();

  return (
    <ButtonPill
      primary
      disabled={!isReadyToSave || isPublishingModel(values.name)}
      onClick={async () => {
        if (isReadyToSave) {
          switch (activeTab) {
            case 'edit':
              saveForm({ values });
              break;
            case 'images':
              break;
            default:
              break;
          }
        }
      }}
      {...props}
    >
      <SaveIcon />
      Save
    </ButtonPill>
  );
};

export default SaveModel;
