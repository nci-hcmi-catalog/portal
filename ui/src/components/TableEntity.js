import React from 'react';
import { stringify } from 'query-string';

export default ({ sqon, savedSetsContext, state, value, history }) => (
  <div
    className="clickable"
    onClick={async () => {
      if (sqon) {
        const { setId } = await savedSetsContext.createSet({
          sqon,
          sort: [...state.sorted, { id: 'name', desc: false }].map(({ id, desc }) => ({
            field: id,
            order: desc ? 'desc' : 'asc',
          })),
        });
        if (setId) {
          history.push({
            pathname: `/model/${value}`,
            search: stringify({
              sqon: JSON.stringify({
                op: 'in',
                content: { field: 'setId', value: setId },
              }),
            }),
          });
        }
        return;
      }
      history.push(`/model/${value}`);
    }}
  >
    {value}
  </div>
);
