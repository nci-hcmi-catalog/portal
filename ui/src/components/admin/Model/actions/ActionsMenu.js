import React from 'react';
import { ModelSingleContext } from '../ModelSingleController';
import { ActionsMenu, ActionsMenuItem } from 'theme/adminControlsStyles';

export default () => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        form: { values },
      },
      unpublishModel,
    }) => (
      <ActionsMenu>
        {values.status === 'published' && (
          <ActionsMenuItem onClick={() => unpublishModel(values)}>Unpublish</ActionsMenuItem>
        )}
        <ActionsMenuItem>Delete</ActionsMenuItem>
      </ActionsMenu>
    )}
  </ModelSingleContext.Consumer>
);
