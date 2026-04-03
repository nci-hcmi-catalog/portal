import { css } from '@emotion/react';
import querystring from 'query-string';
import { useTableContext } from '@overture-stack/arranger-components';

const { stringify } = querystring;

const TableMatchedModelsCell = ({ row, savedSetsContext, history }) => {
  const { sorting } = useTableContext({
    callerName: 'TableMatchedModelsCell',
  });
  const matches = row.original.matched_models?.models || [];
  const matchCount = matches.length;
  return row.original.has_matched_models ? (
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
