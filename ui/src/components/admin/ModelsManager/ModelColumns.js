import React, { useContext, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import Popup from 'reactjs-popup';
import MomentReact from 'react-moment';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

import { ModelManagerContext } from './ModelManagerController';
import { NotificationsContext, usePublishNotifications } from '../Notifications';
import { modelEditUrlBase } from '../AdminNav';
import withDeleteModal from '../DeleteModal';

import EditIcon from 'icons/EditIcon';
import MoreOptionsIcon from 'icons/MoreOptionsIcon';

import { schemaArr } from '@hcmi-portal/cms/src/schemas/descriptions/model';
import { ActionPill, ActionLinkPill, Actions, ToolbarText } from '../../../theme/adminTableStyles';
import { SmallPill, ActionsMenu, ActionsMenuItem } from 'theme/adminControlsStyles';
import { filters } from '@hcmi-portal/cms/src/helpers/dataFilters';
import { modelStatus } from '@hcmi-portal/cms/src/helpers/modelStatus';

const selectedColumns = [
  'name',
  'type',
  'growth_rate',
  'split_ratio',
  'gender',
  'race',
  'age_at_diagnosis',
  'age_at_sample_acquisition',
  'primary_site',
  'neoadjuvant_therapy',
  'chemotherapeutic_drugs',
  'disease_status',
  'vital_status',
  'therapy',
  'clinical_tumor_diagnosis',
  'histological_type',
  'site_of_sample_acquisition',
  'tumor_histological_grade',
  'createdAt',
  'updatedAt',
  'updatedBy',
];

export const ModelStatusPill = ({ data = null }) => {
  switch (data) {
    case modelStatus.published:
      return <SmallPill>{modelStatus.published}</SmallPill>;
    case modelStatus.unpublishedChanges:
      return <SmallPill warning>{modelStatus.unpublishedChanges}</SmallPill>;
    case modelStatus.unpublished:
      return <SmallPill info>{modelStatus.unpublished}</SmallPill>;
    default:
      return <SmallPill primary>{data}</SmallPill>;
  }
};

export const ModelStatusPillWithPublish = ({ name, data }) => {
  const { location, publishProgress } = useContext(NotificationsContext);
  const { isPublishingModel, publishRunning } = usePublishNotifications();
  const [status, setStatus] = useState(null);
  const publishState = useRef();

  // Force status pill to change to "Published" after single model in bulk publishes
  // (prior to table data refresh that occurs after entire bulk publish finishes)
  useEffect(() => {
    if (isPublishingModel(name) && (!publishState || !publishState.current)) {
      publishState.current = 'publishing';
    }
    if (
      location &&
      location.pathname === '/admin' &&
      publishState.current === 'publishing' &&
      publishProgress.success.find(model => model.modelName === name)
    ) {
      publishState.current = 'published';
      setStatus('published');
      return;
    }
  }, [location, publishRunning, publishProgress, name, isPublishingModel]);

  return isPublishingModel(name) ? (
    <SmallPill primary>Publish in Progress</SmallPill>
  ) : (
    <ModelStatusPill data={status || data} />
  );
};

const actionAndClose = (action, close) => () => {
  action();
  close();
};

export const columns = schemaArr
  .filter(field => selectedColumns.indexOf(field.accessor) !== -1)
  .map(field => {
    field.Header = field.displayName;
    return field;
  });

// create this as an array in order to concat it with rest of the columns
// concatenation order of array decides the order of columns in table
const nameColumn = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: row => (
      <Link secondary={`true`} to={modelEditUrlBase + '/' + row.value}>
        {row.value}
      </Link>
    ),
  },
];
const modelManagerCustomColumns = [
  {
    Header: 'Updated',
    accessor: 'updatedAt',
    queryFilter: filters.date,
    Cell: row => {
      const value = row.value;
      return (
        <Popup
          trigger={() => (
            <div>
              <MomentReact fromNow>{value}</MomentReact>
            </div>
          )}
          position="top center"
          offset={0}
          on="hover"
          mouseLeaveDelay={30}
          mouseEnterDelay={10}
          contentStyle={{
            padding: '0px',
            border: 'none',
            width: 'max-content',
          }}
          arrow={true}
        >
          <ToolbarText>
            <MomentReact parse="YYYY-MM-DD HH:mm" tz={moment.tz.guess()}>
              {value}
            </MomentReact>
          </ToolbarText>
        </Popup>
      );
    },
  },
  {
    Header: 'Status',
    accessor: 'status',
    filter: (cellValue, filterValue) =>
      cellValue.toLowerCase().startsWith(filterValue.toLowerCase()),
    queryFilter: filters.startsWith,
    Cell: ({ original: { name, status } }) => {
      let modelStatus = (status || 'Unpublished').toLowerCase();
      return <ModelStatusPillWithPublish name={name} data={modelStatus} />;
    },
  },
  {
    Header: 'Actions',
    accessor: 'name',
    Cell: ({ original: { name, status } }) => {
      return (
        <Actions>
          <ActionLinkPill secondary={'true'} to={modelEditUrlBase + '/' + name}>
            <EditIcon width={'12px'} height={'12px'} />
            Edit
          </ActionLinkPill>
          <Popup
            trigger={
              <div>
                <ActionPill aria-label="More options" secondary>
                  <MoreOptionsIcon
                    css={css`
                      margin: 0;
                    `}
                  />
                </ActionPill>
              </div>
            }
            position="bottom right"
            offset={0}
            contentStyle={{
              padding: '0px',
              border: 'none',
              borderRadius: '10px',
              width: 'max-content',
            }}
            arrow={false}
          >
            {close => (
              <ModelManagerContext.Consumer>
                {({ publishOne, unpublishOne, deleteOne }) => (
                  <ActionsMenu>
                    {status === 'published' ? (
                      <ActionsMenuItem onClick={actionAndClose(() => unpublishOne(name), close)}>
                        Unpublish
                      </ActionsMenuItem>
                    ) : (
                      <ActionsMenuItem onClick={actionAndClose(() => publishOne(name), close)}>
                        Publish
                      </ActionsMenuItem>
                    )}
                    {withDeleteModal({
                      next: actionAndClose(() => deleteOne(name), close),
                      target: name,
                      onCancel: close,
                    })(<ActionsMenuItem>Delete</ActionsMenuItem>)}
                  </ActionsMenu>
                )}
              </ModelManagerContext.Consumer>
            )}
          </Popup>
        </Actions>
      );
    },
  },
];

export const ModelTableColumns = nameColumn
  .concat(columns.filter(col => ['type', 'updatedBy'].includes(col.accessor)))
  .concat(modelManagerCustomColumns);
