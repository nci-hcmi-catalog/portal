import React from 'react';
import { ModelSingleContext } from '../ModelSingleController';
import { HoverPill } from 'theme/adminControlsStyles';
import AdminModelSaveIcon from 'icons/AdminModelSaveIcon';

export default props => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { values, isReadyToSave },
        ui: { activeTab },
      },
      saveForm,
    }) => (
      <HoverPill
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
        <AdminModelSaveIcon css={'margin-right: 8px;'} height={14} width={14} />Save
      </HoverPill>
    )}
  </ModelSingleContext.Consumer>
);
