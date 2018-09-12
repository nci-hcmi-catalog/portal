import React from 'react';
import Popup from 'reactjs-popup';
import Moment from 'react-moment';

import { modelEditUrlBase } from '../AdminNav';

import AdminEditPencilIcon from 'icons/AdminEditPencilIcon';
import AdminModelMoreOptionsIcon from 'icons/AdminModelMoreOptionsIcon';

import { schemaArr } from '../schema/model';
import { ActionLinkPill, Actions, ToolbarText } from '../../../theme/adminTableStyles';
import { SmallPill, ActionsMenu, ActionsMenuItem } from 'theme/adminControlsStyles';

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
];

export const columns = schemaArr
  .filter(field => selectedColumns.indexOf(field.accessor) !== -1)
  .map(field => {
    field.Header = field.displayName;
    return field;
  });

const modelManagerCustomColumns = [
  {
    Header: 'Updated',
    accessor: 'updatedAt',
    Cell: row => {
      const value = row.value;
      return (
        <Popup
          trigger={() => <Moment fromNow>{value}</Moment>}
          position="top"
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
            <Moment parse="YYYY-MM-DD HH:mm">{value}</Moment>
          </ToolbarText>
        </Popup>
      );
    },
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: row => {
      let statusValue = (row.value || 'Unpublished').toLowerCase();
      if (statusValue === 'unpublished changes') {
        return <SmallPill warning>Unpublished Changes</SmallPill>;
      } else if (statusValue === 'published') {
        return <SmallPill>Published</SmallPill>;
      } else {
        return <SmallPill info>Unpublished</SmallPill>;
      }
    },
  },
  {
    Header: 'Actions',
    accessor: 'name',
    Cell: row => {
      const data = row;
      return (
        <Actions>
          <ActionLinkPill secondary marginRight="6px" to={modelEditUrlBase + '/' + data.value}>
            <AdminEditPencilIcon
              css={`
                width: 12px;
                height: 12px;
              `}
            />
            Edit
          </ActionLinkPill>
          <Popup
            trigger={
              <ActionLinkPill
                secondary
                css={`
                  height: 26px;
                `}
                to={() => ''}
              >
                <AdminModelMoreOptionsIcon css={'margin: 0;'} width={15} height={3} />
              </ActionLinkPill>
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
            <ActionsMenu>
              <ActionsMenuItem>Publish</ActionsMenuItem>
              <ActionsMenuItem>Delete</ActionsMenuItem>
            </ActionsMenu>
          </Popup>
        </Actions>
      );
    },
  },
];

export const ModelTableColumns = columns
  .filter(col => ['name', 'type'].includes(col.accessor))
  .concat(modelManagerCustomColumns);
