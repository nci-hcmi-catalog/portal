import React from 'react';
import { ModelSingleContext } from '../ModelSingleController';
import { ButtonPill } from 'theme/adminControlsStyles';
import SaveIcon from 'icons/SaveIcon';

export default props => (
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
        <SaveIcon height={11} width={11} fill={'#fff'} />
        Save
      </ButtonPill>
    )}
  </ModelSingleContext.Consumer>
);
