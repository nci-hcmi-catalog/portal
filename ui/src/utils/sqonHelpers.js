import { addInSQON, removeSQON } from '@overture-stack/arranger-components/dist/SQONViewer/utils';
import { get } from 'lodash';

export const filterExpanded = (sqon, showExpandedStatus = false) => {
  return showExpandedStatus ? sqon : removeSQON('expanded', sqon);
};

export const toggleExpanded = (sqon, showUnexpanded = false) =>
  showUnexpanded
    ? removeSQON('expanded', sqon)
    : addInSQON(
        {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                fieldName: 'expanded',
                value: ['true'],
              },
            },
          ],
        },
        sqon,
      );

export const getNumUnexpanded = async (sqon, apiFetcher) => {
  const query = `query NumberUnexpanded ($filters: JSON) {
          model {
            hits(filters: $filters) {
              total
            }
          }
        }`;

  const filters = addInSQON(
    {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            fieldName: 'expanded',
            value: ['false'],
          },
        },
      ],
    },
    sqon,
  );

  const response = await apiFetcher({
    endpointTag: 'NumberUnexpanded',
    body: { query, variables: { filters } },
  });

  const data = get(response, `data.model.hits.total`, 0);

  return data;
};
