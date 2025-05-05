import React from 'react';
import { css } from '@emotion/react';
import { stringify } from 'query-string';

const TableMatchedModelsCell = ({ row, savedSetsContext, state, value, history }) => {
  const matches = (value && value.split(',')) || 0;
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
          sort: [...state.sorted, { id: 'name', desc: false }].map(({ id, desc }) => ({
            field: id,
            order: desc ? 'desc' : 'asc',
          })),
        });
        if (setId) {
          history.push({
            pathname: `/model/${row.name}`,
            search: stringify({
              sqon: JSON.stringify({
                op: 'in',
                content: { fieldName: 'setId', value: setId },
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
