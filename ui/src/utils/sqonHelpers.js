import { get } from 'lodash';
import { SqonBuilder } from '@overture-stack/sqon';

const sortClauses = (a, b) => {
  if (a.content.fieldName && b.content.fieldName) {
    return a.content.fieldName.localeCompare(b.content.fieldName);
  } else if (a.content.fieldName || b.content.fieldName) {
    return a.content.fieldName ? -1 : 1;
  } else {
    return 0;
  }
};

const clausesOf = (node) =>
  node.op === 'and' && Array.isArray(node.content) ? node.content : [node];

const clauseKey = (clause) =>
  `${clause.op.toLowerCase()}|${clause.content.fieldName ?? clause.content.entity}`;

const valuesOf = (clause) => [].concat(clause.content.value ?? []);

/**
 * Merge `ctxq`'s clauses into `q`, widening any `in` filter already on the same field.
 *
 * @param {object|null} q the SQON being added to
 * @param {object|null} ctxq the SQON whose clauses are merged in
 * @returns {object|null} an `and` combination ordered by field name, or null when empty
 */
export const addInSQON = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  try {
    const existing = new Map(clausesOf(q).map((clause) => [clauseKey(clause), clause]));

    const merged = clausesOf(ctxq).reduce((builder, clause) => {
      const prior = existing.get(clauseKey(clause));

      if (prior && clause.op === 'in') {
        const union = [...new Set([...valuesOf(prior), ...valuesOf(clause)])].sort();
        return builder.setFilter(clause.content.fieldName, 'in', union);
      }

      return builder.and(clause);
    }, SqonBuilder.from(q));

    const clauses = clausesOf(merged.toValue());

    return clauses.length ? { op: 'and', content: [...clauses].sort(sortClauses) } : null;
  } catch (e) {
    console.error('[addInSQON] Error:', e);
  }
};

/**
 * Remove every clause filtering on `fieldName`, preserving the order of those that remain.
 *
 * @param {string} fieldName the field whose clauses are removed
 * @param {object|null} sqon the SQON to filter
 * @returns {object|null} an `and` combination, or null when nothing is left
 */
export const removeSQON = (fieldName, sqon) => {
  if (!sqon) return null;
  if (!fieldName) return sqon;
  if (Object.keys(sqon).length === 0) return sqon;

  const clauses = clausesOf(SqonBuilder.from(sqon).removeFilter(fieldName).toValue());

  return clauses.length ? { op: 'and', content: clauses } : null;
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
