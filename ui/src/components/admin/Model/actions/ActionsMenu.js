import React from 'react';
import { Route } from 'react-router-dom';
import { ModelSingleContext } from '../ModelSingleController';
import { ActionsMenu, ActionsMenuItem } from 'theme/adminControlsStyles';
import { manageModelsUrlBase } from '../../AdminNav';

export default () => (
  <Route>
    {({ history }) => (
      <ModelSingleContext.Consumer>
        {({
          state: {
            form: { values },
          },
          unpublishModel,
          deleteModel,
        }) => (
          <ActionsMenu>
            {values.status === 'published' && (
              <ActionsMenuItem onClick={() => unpublishModel(values)}>Unpublish</ActionsMenuItem>
            )}
            <ActionsMenuItem
              onClick={() => deleteModel(values.name, () => history.push(manageModelsUrlBase))}
            >
              Delete
            </ActionsMenuItem>
          </ActionsMenu>
        )}
      </ModelSingleContext.Consumer>
    )}
  </Route>
);
