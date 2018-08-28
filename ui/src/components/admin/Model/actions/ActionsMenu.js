import React from 'react';
import { Route } from 'react-router-dom';
import { ModelSingleContext } from '../ModelSingleController';
import { ActionsMenu, ActionsMenuItem } from 'theme/adminControlsStyles';
import { manageModelsUrlBase } from '../../AdminNav';

const makeDoActionThenClose = (action, close) => () => {
  // Do the thing
  action();

  // Close the modal
  close();
};

export default ({ close }) => (
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
              <ActionsMenuItem onClick={makeDoActionThenClose(() => unpublishModel(values), close)}>
                Unpublish
              </ActionsMenuItem>
            )}
            <ActionsMenuItem
              onClick={makeDoActionThenClose(
                () => deleteModel(values.name, () => history.push(manageModelsUrlBase)),
                close,
              )}
            >
              Delete
            </ActionsMenuItem>
          </ActionsMenu>
        )}
      </ModelSingleContext.Consumer>
    )}
  </Route>
);
