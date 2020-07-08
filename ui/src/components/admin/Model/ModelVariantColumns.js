import React from 'react';
import { schemaArr } from '@hcmi-portal/cms/src/schemas/descriptions/modelVariant';

import { ModelSingleContext } from './ModelSingleController';
import withDeleteModal from '../DeleteModal';

import TrashIcon from 'icons/TrashIcon';

import { ActionPill, Actions } from 'theme/adminTableStyles';

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
    Cell: ({ original: { _id, variant_name, variant_type } }) => {
      return (
        <ModelSingleContext.Consumer>
          {({ deleteVariant }) => (
            <Actions>
              {withDeleteModal({
                next: () => deleteVariant(_id),
                target: `${variant_name}-${variant_type}`,
              })(
                <ActionPill secondary>
                  <TrashIcon fill={'currentColor'} width={12} height={12} />
                  Delete
                </ActionPill>,
              )}
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
