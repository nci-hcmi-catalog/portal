import React from 'react';
import { ModelSingleContext } from './ModelSingleController';

import { AdminHeader } from 'theme/adminStyles';

const headerText = (modelName = null, error = null) => {
  if (error) {
    switch (error.response.status) {
      case '404':
        return `Model ${modelName} not found`;
      default:
        return `Error loading ${modelName}`;
    }
  }

  // If a model name is provided, and no error is present ...
  if (modelName) {
    return modelName;
  }

  // Default is the create state text
  return 'Create a Model';
};

export default ({ modelName }) => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        data: { error },
      },
    }) => (
      <AdminHeader>
        <div>
          <h1>{headerText(modelName, error)}</h1>
        </div>
      </AdminHeader>
    )}
  </ModelSingleContext.Consumer>
);
