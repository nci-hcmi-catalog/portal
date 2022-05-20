import React from 'react';
import { css } from '@emotion/react';
import { stringify } from 'query-string';

export default ({ sqon, savedSetsContext, state, value, history }) => (
  <button
    className="clickable"
    css={css`
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
          pathname: `/model/${value}`,
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
    {value}
  </button>
);
