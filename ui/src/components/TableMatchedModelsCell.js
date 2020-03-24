import React from 'react';
import { stringify } from 'query-string';

export default ({ row, sqon, savedSetsContext, state, value, history }) => {
  const matchCount = row['matched_models.hits.total'];
  return matchCount > 0 ? (
    <button
      className="clickable"
      css={`
        background: none;
        border: none;
      `}
      onClick={async () => {
        const { setId } = await savedSetsContext.createSet({
          sqon,
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
                content: { field: 'setId', value: setId },
              }),
            }),
          });
        }
      }}
    >
      Yes ({matchCount})
    </button>
  ) : (
    <span css={``}>No</span>
  );
};