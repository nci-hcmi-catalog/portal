import React from 'react';
import { ModelSingleContext } from '../ModelSingleController';
import { Pill } from 'theme/adminControlsStyles';
import AdminModelSaveIcon from 'icons/AdminModelSaveIcon';

export default props => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { isReadyToSave },
        ui: { activeTab },
      },
      saveForm,
      uploadImages,
    }) => (
      <Pill
        primary
        disabled={!isReadyToSave}
        onClick={() => {
          if (isReadyToSave) {
            switch (activeTab) {
              case 'edit':
                saveForm();
                break;
              case 'images':
                uploadImages();
                saveForm();
                break;
              default:
                break;
            }
          }
        }}
        {...props}
      >
        <AdminModelSaveIcon css={'margin-right: 8px;'} height={14} width={14} />Save
      </Pill>
    )}
  </ModelSingleContext.Consumer>
);
