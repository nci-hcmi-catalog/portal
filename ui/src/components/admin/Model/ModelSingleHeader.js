import React from 'react';
import Popup from 'reactjs-popup';

import { ModelSingleContext } from './ModelSingleController';
import { manageModelsUrlBase } from '../AdminNav';

import { SaveModel, PublishModel, ActionsMenu } from './actions';

import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import AdminModelMoreOptionsIcon from 'icons/AdminModelMoreOptionsIcon';

import { AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { ModelHeaderH1, ModelHeaderBackLink } from 'theme/adminModelStyles';
import { SmallPill, Pill } from 'theme/adminControlsStyles';

const headerText = (modelName = null, error = null) => {
  // Default is the create state text
  let text = 'Create a Model';

  // Error text
  if (error) {
    if (error.response.status) {
      switch (error.response.status) {
        case '404':
          text = 'Model {modelName} not found';
          break;
        default:
          text = 'Error loading {modelName}';
      }
    } else {
      text = 'Unkown error has occured';
    }
  }

  // If a model name is provided, and no error is present ...
  if (modelName) {
    text = modelName;
  }

  return <ModelHeaderH1>{text}</ModelHeaderH1>;
};

const modelStatus = (data = null) => {
  switch (data.status) {
    case 'published':
      return <SmallPill>{data.status}</SmallPill>;
    case 'unpublished changes':
      return <SmallPill warning>{data.status}</SmallPill>;
    case 'unpublished':
      return <SmallPill info>{data.status}</SmallPill>;
    default:
      return <SmallPill primary>{data.status}</SmallPill>;
  }
};

const modelMoreOptions = (data = null) =>
  data && (
    <Popup
      trigger={
        <Pill secondary marginLeft="10px">
          <AdminModelMoreOptionsIcon css={'margin: 0;'} width={15} height={3} />
        </Pill>
      }
      position="bottom right"
      offset={0}
      on="click"
      closeOnDocumentClick
      mouseLeaveDelay={300}
      mouseEnterDelay={0}
      contentStyle={{
        padding: '0px',
        border: 'none',
        borderRadius: '10px',
        width: 'max-content',
      }}
      arrow={false}
    >
      <ActionsMenu />
    </Popup>
  );

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
          {response.status && modelStatus(response)}
        </AdminHeaderBlock>
        <AdminHeaderBlock>
          <ModelHeaderBackLink to={manageModelsUrlBase}>
            <ArrowLeftIcon height={9} width={5} /> Back to List
          </ModelHeaderBackLink>
          <PublishModel marginLeft="21px" marginRight="10px" />
          <SaveModel />
          {modelMoreOptions(response || null)}
        </AdminHeaderBlock>
      </AdminHeader>
    )}
  </ModelSingleContext.Consumer>
);
