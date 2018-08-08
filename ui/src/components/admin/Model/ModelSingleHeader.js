import React from 'react';
import { ModelSingleContext } from './ModelSingleController';
import { manageModelsUrlBase } from '../AdminNav';

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
        text = 'Model {modelName} not found';
        break;
      default:
        text = 'Error loading {modelName}';
    }
  }

  // If a model name is provided, and no error is present ...
  if (modelName) {
    text = modelName;
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
          <ModelHeaderBackLink href={manageModelsUrlBase}>
            <ArrowLeftIcon height={9} width={5} /> Back to List
          </ModelHeaderBackLink>
          <Pill disabled marginLeft="21px" marginRight="10px">
            Publish
          </Pill>
          <Pill primary disabled marginRight="10px">
            Save
          </Pill>
        </AdminHeaderBlock>
      </AdminHeader>
    )}
  </ModelSingleContext.Consumer>
);
