import React from 'react';
import { css } from '@emotion/react';
import { stringify } from 'query-string';
import { useTableContext } from '@overture-stack/arranger-components';

const TableMatchedModelsCell = ({ row, savedSetsContext, value, history }) => {
  const { sorting } = useTableContext({
    callerName: 'TableMatchedModelsCell',
  });
  const matches = (value && value.split(',')) || [];
  const matchCount = matches.length;
  return matchCount > 1 ? (
    <button
      className="clickable"
      css={css`
        background: none;
        border: none;
      `}
      onClick={async () => {
        const { setId } = await savedSetsContext.createSet({
          sqon: {
            op: 'and',
            content: [{ op: 'in', content: { fieldName: 'name', value: matches } }],
          },
          sort: [...sorting, { fieldName: 'name', desc: false }].map(({ fieldName, desc }) => ({
            fieldName,
            order: desc ? 'desc' : 'asc',
          })),
        });
        if (setId) {
          history.push({
            pathname: `/model/${row.original.name}`,
            search: stringify({
              sqon: JSON.stringify({
                content: [
                  {
                    op: 'in',
                    content: { fieldName: 'setId', value: setId },
                  },
                ],
                op: 'and',
              }),
            }),
          });
        }
      }}
    >
      Yes ({matchCount})
    </button>
  ) : (
    <span>No</span>
  );
};

export default TableMatchedModelsCell;
