import React from 'react';
import { Route } from 'react-router-dom';
import { ModelSingleContext } from '../ModelSingleController';
import { ActionsMenu, ActionsMenuItem } from 'theme/adminControlsStyles';
import { manageModelsUrlBase } from '../../AdminNav';
import withDeleteModal from '../../DeleteModal';

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
            {withDeleteModal({
              next: makeDoActionThenClose(
                () => deleteModel(values.name, () => history.push(manageModelsUrlBase)),
                close,
              ),
              target: values.name,
              onCancel: close,
            })(<ActionsMenuItem>Delete</ActionsMenuItem>)}
          </ActionsMenu>
        )}
      </ModelSingleContext.Consumer>
    )}
  </Route>
);
