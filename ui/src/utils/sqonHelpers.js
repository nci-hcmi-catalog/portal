import { get } from 'lodash';

/**
 * ARRANGER UTILS
 * The following utils are copied directly from the Arranger library, as we have been informed that
 * they were not intended to be exported. We will keep them here until we can find a better solution.
 * - compareTerms
 * - sortSQON
 * - addInValue
 * - addInSQON
 * - removeSQON
 */

// ARRANGER UTIL
const compareTerms = (a, b) => {
  return (
    a.op.toLowerCase() === b.op.toLowerCase() &&
    (a.content.fieldName
      ? a.content.fieldName === b.content.fieldName
      : a.content.entity === b.content.entity)
  );
};

// ARRANGER UTIL
const sortSQON = (a, b) => {
  if (a.content.fieldName && b.content.fieldName) {
    return a.content.fieldName.localeCompare(b.content.fieldName);
  } else if (a.content.fieldName || b.content.fieldName) {
    return a.content.fieldName ? -1 : 1;
  } else {
    return 0;
  }
};

// ARRANGER UTIL
const addInValue = (x, y) => {
  const xValue = [].concat(x.content.value || []);
  const yValue = [].concat(y.content.value || []);

  if (xValue.length === 0 && yValue.length === 0) return null;
  if (xValue.length === 0) return y;
  if (yValue.length === 0) return x;

  const merged = {
    op: 'in',
    content: {
      fieldName: x.content.fieldName,
      value: xValue
        .reduce((acc, v) => {
          if (acc.includes(v)) return acc;
          return [...acc, v];
        }, yValue)
        .sort(),
    },
  };

  return merged.content.value.length ? merged : null;
};

// ARRANGER UTIL
export const addInSQON = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  try {
    const merged = {
      op: 'and',
      content: ctxq.content
        .reduce((acc, ctx) => {
          const found = acc.find((a) => compareTerms(a, ctx));
          if (!found) return [...acc, ctx];
          return [
            ...acc.filter((y) => y.content.fieldName !== found.content.fieldName),
            addInValue(found, ctx),
          ].filter(Boolean);
        }, q.content)
        .sort(sortSQON),
    };

    return merged.content.length ? merged : null;
  } catch (e) {
    console.error('[addInSQON] Error:', e);
  }
};

// ARRANGER UTIL
export const removeSQON = (fieldName, sqon) => {
  if (!sqon) return null;
  if (!fieldName) return sqon;
  if (Object.keys(sqon).length === 0) return sqon;

  if (!Array.isArray(sqon.content)) {
    const fieldFilter =
      typeof fieldName === 'function' ? fieldName : (input) => input === fieldName;
    return fieldFilter(sqon.content.fieldName) ? null : sqon;
  }

  const filteredContent = sqon.content.map((q) => removeSQON(fieldName, q)).filter(Boolean);

  return filteredContent.length
    ? {
        ...sqon,
        content: filteredContent,
      }
    : null;
};

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
                fieldName: 'expanded',
                value: ['true'],
              },
            },
          ],
        },
        sqon,
      );
};

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
    removeSQON('expanded', sqon),
  );

  const response = await apiFetcher({
    endpointTag: 'NumberUnexpanded',
    body: { query, variables: { filters } },
  });

  const data = get(response, `data.model.hits.total`, 0);

  return data;
};
