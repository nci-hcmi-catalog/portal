import React from 'react';
import { css } from '@emotion/react';
import { stringify } from 'query-string';

const TableEntity = ({
  sqon,
  savedSetsContext,
  searchWrapperSetState,
  tableState,
  value,
  history,
}) => {
  const { createSet } = savedSetsContext;
  return (
    <button
      className="clickable"
      css={css`
        background: none;
        border: none;
      `}
      onClick={async () => {
        searchWrapperSetState({ loading: true });
        const { setId } = await createSet({
          sqon,
          sort: [...(tableState?.sorted || []), { id: 'name', desc: false }].map(
            ({ id, desc }) => ({
              fieldName: id,
              order: desc ? 'desc' : 'asc',
            }),
          ),
        });
        if (setId) {
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
