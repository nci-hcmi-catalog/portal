import {
  addInSQON,
  removeSQON,
  replaceFieldSQON,
} from '@overture-stack/arranger-components/dist/SQONViewer/utils';
import { get } from 'lodash';

export const filterExpanded = (sqon, showExpandedStatus = false) => {
  return showExpandedStatus ? sqon : removeSQON('expanded', sqon);
};

export const toggleExpanded = (currentSqon, showUnexpanded = false) => {
  // Default SQON value using expanded state
  const sqon = currentSqon
    ? currentSqon
    : {
        content: [
          {
            content: {
              fieldName: 'expanded',
              value: [`${showUnexpanded}`],
            },
            op: 'in',
          },
        ],
        op: 'and',
      };
  return showUnexpanded
    ? addInSQON(
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
      )
    : replaceFieldSQON('expanded', ['true'], sqon);
};

const unexpandedFilter = {
  op: 'in',
  content: {
    fieldName: 'expanded',
    value: ['false'],
  },
};

export const getNumUnexpanded = async (sqon, apiFetcher) => {
  const query = `query NumberUnexpanded ($filters: JSON) {
          model {
            hits(filters: $filters) {
              total
            }
          }
        }`;

  const isExpandedFilter = (item) =>
    item.op === unexpandedFilter.op &&
    item.content.fieldName === unexpandedFilter.content.fieldName;
  const hasExpandedFilter = sqon?.content.find(isExpandedFilter);
  const filters = sqon
    ? hasExpandedFilter
      ? {
          ...sqon,
          content: sqon.content.map((item) => {
            if (isExpandedFilter(item)) {
              return unexpandedFilter;
            }

            return item;
          }),
        }
      : {
          ...sqon,
          content: [...sqon.content, unexpandedFilter],
        }
    : {
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
      };

  const response = await apiFetcher({
    endpointTag: 'NumberUnexpanded',
    body: { query, variables: { filters } },
  });

  const data = get(response, `data.model.hits.total`, 0);

  return data;
};
