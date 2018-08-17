import React from 'react';
import { ModelSingleContext } from '../ModelSingleController';
import { Pill } from 'theme/adminControlsStyles';
import AdminModelSaveIcon from 'icons/AdminModelSaveIcon';

export default props => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { isReadyToSave, values },
      },
      saveForm,
    }) => (
      <Pill
        primary
        disabled={!isReadyToSave}
        onClick={() => isReadyToSave && saveForm(values)}
        {...props}
      >
        <AdminModelSaveIcon css={'margin-right: 8px;'} height={14} width={14} />Save
      </Pill>
    )}
  </ModelSingleContext.Consumer>
);
