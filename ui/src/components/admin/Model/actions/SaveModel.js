import React from 'react';
import { ModelSingleContext } from '../ModelSingleController';
import { ButtonPill } from 'theme/adminControlsStyles';
import SaveIcon from 'icons/SaveIcon';

const SaveModel = props => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { values, isReadyToSave },
        ui: { activeTab },
      },
      saveForm,
    }) => (
      <ButtonPill
        primary
        disabled={!isReadyToSave}
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
    )}
  </ModelSingleContext.Consumer>
);

export default SaveModel;
