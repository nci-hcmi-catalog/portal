import React from 'react';
import { css } from '@emotion/react';
import { stringify } from 'query-string';

const TableEntity = ({ sqon, savedSetsContext, setState, state, value, history }) => {
  return (
    <button
      className="clickable"
      css={css`
        background: none;
        border: none;
      `}
      onClick={async () => {
        setState({ loading: true });
        const { setId, ids } = await savedSetsContext.createSet({
          sqon,
          sort: [...(state?.sorted || []), { id: 'name', desc: false }].map(({ id, desc }) => ({
            fieldName: id,
            order: desc ? 'desc' : 'asc',
          })),
        });
        if (setId) {
          setState({
            loading: false,
            sets: {
              ...state.sets,
              [setId]: { sqon, ids },
            },
          });
          history.push({
            pathname: `/model/${value}`,
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
      {value}
    </button>
  );
};

export default TableEntity;
