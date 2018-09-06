import React from 'react';
import AdminEditPencilIcon from 'icons/AdminEditPencilIcon';
import { schemaArr } from '../schema/modelVariant';
import { ActionPill, Actions } from '../../../theme/adminTableStyles';

const selectedColumns = ['name', 'assessmentType', 'expressionLevel'];

export const columns = schemaArr
  .filter(field => selectedColumns.indexOf(field.accessor) !== -1)
  .map(field => {
    field.Header = field.displayName;
    return field;
  });

const modelVariantCustomColumns = [
  {
    Header: 'Actions',
    accessor: 'name',
    Cell: () => {
      return (
        <Actions>
          <ActionPill secondary marginRight="6px" to={''}>
            <AdminEditPencilIcon
              css={`
                width: 12px;
                height: 12px;
              `}
            />
            Delete
          </ActionPill>
        </Actions>
      );
    },
  },
];

export const ModelVariantColumns = columns
  .filter(col => ['name', 'assessmentType', 'expressionLevel'].includes(col.accessor))
  .concat(modelVariantCustomColumns);