import React from 'react';
import { css } from '@emotion/react';
import { stringify } from 'query-string';
import { useTableContext } from '@overture-stack/arranger-components';
import { isNil } from 'lodash';

const TableEntity = ({ sqon, savedSetsContext, value, history }) => {
  const { createSet } = savedSetsContext;
  const { sorting } = useTableContext({
    callerName: 'TableEntity',
  });
  return (
    <button
      className="clickable"
      css={css`
        background: none;
        border: none;
      `}
      onClick={async () => {
        const entitySqon = isNil(sqon) ? { op: 'and', content: [] } : sqon;
        const { setId } = await createSet({
          sqon: entitySqon,
          sort: [...sorting, { fieldName: 'name', desc: false }].map(({ fieldName, desc }) => ({
            fieldName,
            order: desc ? 'desc' : 'asc',
          })),
        });
        if (setId) {
          history.push({
            pathname: `/model/${value}`,
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
      {value}
    </button>
  );
};

export default TableEntity;
