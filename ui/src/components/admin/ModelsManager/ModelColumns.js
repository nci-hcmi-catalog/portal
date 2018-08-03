import React from 'react';
import {
  UnpublishedChangesModel,
  PublishedModel,
  UnpublishedModel,
  ActionPill,
  Actions,
  ActionsMenu,
  ActionsMenuItem,
} from '../../../theme/adminTableStyles';
import PencilIcon from 'react-icons/lib/fa/pencil';
import Popup from 'reactjs-popup';

const columns = [
  {
    Header: 'id',
    accessor: '_id',
  },
  {
    Header: 'Name',
    accessor: 'model_name',
  },
  {
    Header: 'Type',
    accessor: 'model_type',
  },
  {
    Header: 'Growth Rate',
    accessor: 'growth_rate',
  },
  {
    Header: 'Split Ratio',
    accessor: 'split_ratio',
  },
  {
    Header: 'Gender',
    accessor: 'gender',
  },
  {
    Header: 'Race',
    accessor: 'race',
  },
  {
    Header: 'Age At Diagnosis',
    accessor: 'age_at_diagnosis',
  },
  {
    Header: 'Age At Sample Acquisition',
    accessor: 'age_at_sample_acquisition',
  },
  {
    Header: 'Primary Site',
    accessor: 'primary_site',
  },
  {
    Header: 'Neoadjuvant Therapy',
    accessor: 'neoadjuvant_therapy',
  },
  {
    Header: 'Chemotherapeutic Drugs',
    accessor: 'chemotherapeutic_drugs',
  },
  {
    Header: 'Disease Status',
    accessor: 'disease_status',
  },
  {
    Header: 'Vital Status',
    accessor: 'vital_status',
  },
  {
    Header: 'Therapy',
    accessor: 'therapy',
  },
  {
    Header: 'Clinical Tumor Diagnosis',
    accessor: 'clinical_tumor_diagnosis',
  },
  {
    Header: 'Histological Type',
    accessor: 'histological_type',
  },
  {
    Header: 'Site Of Sample Acquisition',
    accessor: 'site_of_sample_acquisition',
  },
  {
    Header: 'Tumor Histological Grade',
    accessor: 'tumor_histological_grade',
  },
  {
    Header: 'CreatedAt',
    accessor: 'createdAt',
  },
  {
    Header: 'UpdatedAt',
    accessor: 'updatedAt',
  },
];

const modelManagetSpecificColumns = [
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
    accessor: 'actions',
    Cell: row => {
      return (
        <Actions>
          <ActionPill onClick={row => console.log(row)}>
            <PencilIcon
              css={`
                width: 20px;
                padding-right: 5px;
              `}
            />{' '}
            Edit{' '}
          </ActionPill>
          <Popup
            trigger={<ActionPill onClick={row => console.log('... clicked')}> ...</ActionPill>}
            position="left"
            offset={0}
            on="click"
            closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            contentStyle={{
              padding: '0px',
              border: 'none',
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
  .filter(col => ['model_name', 'updatedAt', 'model_type'].includes(col.accessor))
  .concat(modelManagetSpecificColumns);
