import React from 'react';
import { schemaArr } from '../schema/model';
import {
  UnpublishedChangesModel,
  PublishedModel,
  UnpublishedModel,
  ActionPill,
  Actions,
  ActionsMenu,
  ActionsMenuItem,
  ToolbarText,
} from '../../../theme/adminTableStyles';
import AdminEditPencilIcon from 'icons/AdminEditPencilIcon';
import Popup from 'reactjs-popup';
import { modelEditUrlBase } from '../AdminNav';
import Moment from 'react-moment';

const selectedColumns = [
  'name',
  'model_type',
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
      if (statusValue === 'unpublishedchanges') {
        return <UnpublishedChangesModel>Unpublished Changes</UnpublishedChangesModel>;
      } else if (statusValue === 'published') {
        return <PublishedModel>Published</PublishedModel>;
      } else {
        return <UnpublishedModel>Unpublished</UnpublishedModel>;
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
          <ActionPill to={modelEditUrlBase + '/' + data.value}>
            <AdminEditPencilIcon
              css={`
                width: 12px;
                height: 12px;
              `}
            />
            <span
              css={`
                width: 27px;
                height: 10px;
                font-size: 12px;
                font-weight: 500;
                font-style: normal;
                font-stretch: normal;
                line-height: 2.17;
                letter-spacing: normal;
                text-align: center;
              `}
            >
              Edit
            </span>
          </ActionPill>
          <Popup
            trigger={
              <ActionPill
                css={`
                  width: 42px;
                `}
                to={() => ''}
              >
                <span
                  css={`
                    width: 27px;
                    height: 3px;
                    font-size: 12px;
                    font-weight: 500;
                    font-style: normal;
                    font-stretch: normal;
                    line-height: 2.17;
                    letter-spacing: normal;
                    text-align: center;
                  `}
                >
                  ...
                </span>
              </ActionPill>
            }
            position="left"
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
            <ActionsMenu
              css={`
                width: 70px;
              `}
            >
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
  .filter(col => ['name', 'model_type'].includes(col.accessor))
  .concat(modelManagerCustomColumns);
