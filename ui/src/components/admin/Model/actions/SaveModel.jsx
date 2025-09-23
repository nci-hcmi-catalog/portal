import { useContext } from 'react';
import { ButtonPill } from '~/theme/adminControlsStyles';
import SaveIcon from '~/icons/SaveIcon';
import { usePublishNotifications } from '../../Notifications';
import { ModelSingleContext } from '../ModelSingleController';

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
