import React from 'react';
import { ModelSingleContext } from './ModelSingleController';

import ArrowLeftIcon from 'icons/ArrowLeftIcon';

import { AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { ModelHeaderH1, ModelHeaderBackLink } from 'theme/adminModelStyles';
import { SmallPill, Pill } from 'theme/adminControlsStyles';

const headerText = (modelName = null, error = null) => {
  // Default is the create state text
  let text = 'Create a Model';

  // Error text
  if (error) {
    switch (error.response.status) {
      case '404':
        text = <h1>Model {modelName} not found</h1>;
        break;
      default:
        text = <h1>Error loading {modelName}</h1>;
    }
  }

  // If a model name is provided, and no error is present ...
  if (modelName) {
    text = { modelName };
  }

  return <ModelHeaderH1>{text}</ModelHeaderH1>;
};

const modelStatus = (data = null) => {
  if (!data) {
    return <SmallPill warning>Unsaved Changes</SmallPill>;
  }

  // Additional statuses here
};

export default ({ modelName }) => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        data: { response, error },
      },
    }) => (
      <AdminHeader>
        <AdminHeaderBlock>
          {headerText(modelName, error)}
          {modelStatus(response.data || null)}
        </AdminHeaderBlock>
        <AdminHeaderBlock>
          <ModelHeaderBackLink href="">
            <ArrowLeftIcon height={9} width={5} /> Back to List
          </ModelHeaderBackLink>
          <Pill marginLeft="21px" marginRight="10px">
            Publish
          </Pill>
          <Pill primary marginRight="10px">
            Save
          </Pill>
        </AdminHeaderBlock>
      </AdminHeader>
    )}
  </ModelSingleContext.Consumer>
);
