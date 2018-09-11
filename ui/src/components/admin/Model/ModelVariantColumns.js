import React from 'react';
import { ModelSingleContext } from './ModelSingleController';
import AdminEditPencilIcon from 'icons/AdminEditPencilIcon';
import { schemaArr } from '../schema/modelVariant';
import { ActionPill, Actions } from '../../../theme/adminTableStyles';

const selectedColumns = ['variant_name', 'variant_type', 'assessment_type', 'expression_level'];

export const columns = schemaArr
  .filter(field => selectedColumns.indexOf(field.accessor) !== -1)
  .map(field => {
    field.Header = field.displayName;
    return field;
  });

const modelVariantCustomColumns = [
  {
    Header: 'Actions',
    accessor: 'actions',
    Cell: ({ original: { id } }) => {
      return (
        <ModelSingleContext.Consumer>
          {({ deleteVariant }) => (
            <Actions>
              <ActionPill secondary marginRight="6px" onClick={() => deleteVariant(id)}>
                <AdminEditPencilIcon
                  css={`
                    width: 12px;
                    height: 12px;
                  `}
                />
                Delete
              </ActionPill>
            </Actions>
          )}
        </ModelSingleContext.Consumer>
      );
    },
  },
];

export const ModelVariantColumns = columns
  .filter(col =>
    ['variant_name', 'variant_type', 'assessment_type', 'expression_level'].includes(col.accessor),
  )
  .concat(modelVariantCustomColumns);
