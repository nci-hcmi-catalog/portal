import { api } from '@arranger/components';
import { addInSQON, removeSQON } from '@arranger/components/dist/SQONView/utils';
import { get } from 'lodash';

import globals from 'utils/globals';

export const filterExpanded = (sqon, showExpandedStatus = false) => {
  return showExpandedStatus ? sqon : removeSQON('expanded', sqon);
};

export const toggleExpanded = (sqon, showUnexpanded = false) => {
  return showUnexpanded
    ? removeSQON('expanded', sqon)
    : addInSQON(
        {
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: 'expanded',
                value: ['true'],
              },
            },
          ],
        },
        sqon,
      );
};

export const getNumUnexpanded = async () => {
  const numUnexpanded = await api({
    endpoint: `/${globals.VERSION}/graphql`,
    body: {
      query: `query($filters: JSON) {
                  models {
                    hits(filters: $filters) {
                      total
                    }
                  }
                }
              `,
      variables: {
        filters: { op: 'in', content: { field: 'expanded', value: ['false'] } },
      },
    },
  });

  const data = await get(numUnexpanded, `data.models.hits.total`, 0);

  return data;
};
