import React from 'react';
import Popup from 'reactjs-popup';

import { ModelSingleContext } from './ModelSingleController';
import { manageModelsUrlBase } from '../AdminNav';

import { SaveModel, PublishModel, ActionsMenu } from './actions';

import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import AdminModelMoreOptionsIcon from 'icons/AdminModelMoreOptionsIcon';

import { AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { ModelHeaderH1, ModelHeaderBackLink } from 'theme/adminModelStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { modelStatusPill } from '../ModelsManager/ModelColumns';
import ExternalLinkIcon from 'icons/ExternalLinkIcon';
import { modelStatus } from '@hcmi-portal/cms/src/helpers/modelStatus';

const headerText = (modelName = null, error = null) => {
  // Default is the create state text
  let text = 'Create a Model';

  // Error text
  if (error) {
    if (error.response && error.response.status) {
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
        <div>
          <ButtonPill secondary disabled={!data || Object.keys(data).length === 0} marginLeft="8px">
          </ButtonPill>
        </div>
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
      disabled={!data || Object.keys(data).length === 0}
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
        <AdminHeader>
          <AdminHeaderBlock
            css={`
              position: relative;
            `}
          >
            {headerText(modelName, error)}
            {response.status && modelStatusPill(response)}
            <ModelHeaderBackLink
              to={manageModelsUrlBase}
              css={`
                position: absolute;
                left: 0;
                bottom: 40px;
              `}
            >
              <ArrowLeftIcon /> Back to List
            </ModelHeaderBackLink>
          </AdminHeaderBlock>
          <AdminHeaderBlock>
            {response.status &&
            (response.status === modelStatus.published ||
              response.status === modelStatus.unpublishedChanges) ? (
              <ModelHeaderBackLink to={`/model/${modelName}`} target="_blank">
                <ExternalLinkIcon
                  height={10}
                  width={10}
                  css={'margin-right: 8px;'}
                  fill={'currentColor'}
                />
                View in Catalog
              </ModelHeaderBackLink>
            ) : (
              ''
            )}
            <PublishModel marginLeft="18px" marginRight="8px" />
            <SaveModel />
            {modelMoreOptions(response || null)}
          </AdminHeaderBlock>
        </AdminHeader>
      </>
    )}
  </ModelSingleContext.Consumer>
);
