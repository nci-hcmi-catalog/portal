import React from 'react';
import Popup from 'reactjs-popup';

import { ModelSingleContext } from './ModelSingleController';
import { manageModelsUrlBase } from '../AdminNav';

import { SaveModel, PublishModel, ActionsMenu } from './actions';

import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import AdminModelMoreOptionsIcon from 'icons/AdminModelMoreOptionsIcon';

import { AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { ModelHeaderH1, ModelHeaderBackLink } from 'theme/adminModelStyles';
import { HoverPill } from 'theme/adminControlsStyles';
import { modelStatusPill } from '../ModelsManager/ModelColumns';
import ExternalLinkIcon from 'icons/ExternalLinkIcon';
import { modelStatus } from '@hcmi-portal/cms/src/helpers/modelStatus';

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
      text = 'Unkown error has occurred';
    }
  }

  // If a model name is provided, and no error is present ...
  if (modelName) {
    text = modelName;
  }

  return <ModelHeaderH1>{text}</ModelHeaderH1>;
};

const modelMoreOptions = (data = null) =>
  data && (
    <Popup
      trigger={
        <HoverPill secondary marginLeft="10px">
          <AdminModelMoreOptionsIcon css={'margin: 0;'} width={15} height={3} />
        </HoverPill>
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
      {close => {
        return <ActionsMenu close={close} />;
      }}
    </Popup>
  );

export default ({ modelName }) => (
  <ModelSingleContext.Consumer>
    {({
      state: {
        data: { response, error },
      },
    }) => (
      <>
        <ModelHeaderBackLink
          css={`
            padding-top: 20px;
          `}
          to={manageModelsUrlBase}
        >
          <ArrowLeftIcon /> Back to List
        </ModelHeaderBackLink>
        <AdminHeader>
          <AdminHeaderBlock>
            {headerText(modelName, error)}
            {response.status && modelStatusPill(response)}
          </AdminHeaderBlock>
          <AdminHeaderBlock>
            {response.status &&
            (response.status === modelStatus.published ||
              response.status === modelStatus.unpublishedChanges) ? (
              <ModelHeaderBackLink to={`/model/${modelName}`}>
                <ExternalLinkIcon height={10} width={10} css={'margin-right: 8px;'} />View in
                catalog
              </ModelHeaderBackLink>
            ) : (
              ''
            )}
            <PublishModel marginLeft="21px" marginRight="10px" />
            <SaveModel />
            {modelMoreOptions(response || null)}
          </AdminHeaderBlock>
        </AdminHeader>
      </>
    )}
  </ModelSingleContext.Consumer>
);
