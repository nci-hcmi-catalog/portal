/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef } from 'react';
import Popup from 'reactjs-popup';
import { css } from '@emotion/react';

import { ModelSingleContext } from './ModelSingleController';
import { manageModelsUrlBase } from '../AdminNav';
import { NotificationsContext, usePublishNotifications } from 'components/admin/Notifications';

import { SaveModel, PublishModel, ActionsMenu } from './actions';

import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import MoreOptionsIcon from 'icons/MoreOptionsIcon';

import { AdminHeader, AdminHeaderBlock } from 'theme/adminStyles';
import { ModelHeaderH1, ModelHeaderBackLink } from 'theme/adminModelStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import { ModelStatusPillWithPublish } from '../ModelsManager/ModelColumns';
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
          <ButtonPill
            aria-label="More Options"
            secondary
            disabled={!data || Object.keys(data).length === 0}
            marginLeft="8px"
          >
            <MoreOptionsIcon
              css={css`
                margin: 0;
              `}
            />
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
      {(close) => {
        return <ActionsMenu close={close} />;
      }}
    </Popup>
  );

const ModelSingleHeader = ({ modelName }) => {
  const {
    state: {
      data: { response, error },
    },
    fetchModelData,
  } = useContext(ModelSingleContext);
  const { publishProgress } = useContext(NotificationsContext);
  const { isPublishingModel, publishRunning } = usePublishNotifications();
  const publishState = useRef();

  // refresh model data after publish completes (get updated publish status)
  useEffect(() => {
    const refreshModelData = async () => await fetchModelData(modelName);

    if (modelName && isPublishingModel(modelName)) {
      publishState.current = 'publishing';
    }

    if (
      modelName &&
      (publishState.current === 'publishing' || !publishState.current) &&
      publishProgress.success.find((model) => model.modelName === modelName)
    ) {
      publishState.current = 'published';
      refreshModelData();
    }
  }, [publishRunning, publishProgress]);

  return (
    <AdminHeader>
      <AdminHeaderBlock
        css={css`
          position: relative;
        `}
      >
        {headerText(modelName, error)}
        <ModelStatusPillWithPublish name={modelName} data={response?.status} />
        <ModelHeaderBackLink
          to={manageModelsUrlBase}
          css={css`
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
              height={'10px'}
              width={'10px'}
              css={css`
                margin-right: 8px;
              `}
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
  );
};

export default ModelSingleHeader;
