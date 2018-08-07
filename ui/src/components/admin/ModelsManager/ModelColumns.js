import { schemaArr } from '../schema/model';

const selectedColumns = [
  'model_name',
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
    accessor: 'model_name',
    Cell: row => {
      const data = row;
      return (
        <Actions>
          <ActionPill to={modelEditUrlBase + '/' + data.value}>
            <PencilIcon
              css={`
                width: 20px;
                padding-right: 5px;
              `}
            />{' '}
            Edit{' '}
          </ActionPill>
          <Popup
            trigger={<ActionPill to={row => console.log('... clicked')}> ...</ActionPill>}
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
