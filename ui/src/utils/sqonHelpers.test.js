import { describe, expect, it } from 'vitest';

import {
  addInSQON,
  filterExpanded,
  getNumUnexpanded,
  removeSQON,
  toggleExpanded,
} from './sqonHelpers';

const inClause = (fieldName, value) => ({ op: 'in', content: { fieldName, value } });
const and = (...content) => ({ op: 'and', content });

describe('addInSQON', () => {
  it('returns null when there is nothing on either side', () => {
    expect(addInSQON(null, null)).toBeNull();
  });

  it('returns whichever side is present when the other is missing', () => {
    const sqon = and(inClause('primary_site', ['Lung']));

    expect(addInSQON(sqon, null)).toEqual(sqon);
    expect(addInSQON(null, sqon)).toEqual(sqon);
  });

  it('unions values for a field into a single clause', () => {
    expect(
      addInSQON(and(inClause('primary_site', ['Lung'])), and(inClause('primary_site', ['Breast']))),
    ).toEqual(and(inClause('primary_site', ['Breast', 'Lung'])));
  });

  it('does not repeat a value that is already selected', () => {
    expect(
      addInSQON(and(inClause('primary_site', ['Lung'])), and(inClause('primary_site', ['Lung']))),
    ).toEqual(and(inClause('primary_site', ['Lung'])));
  });

  it('sorts the values of a clause it merged', () => {
    expect(
      addInSQON(
        and(inClause('primary_site', ['Skin', 'Lung'])),
        and(inClause('primary_site', ['Brain'])),
      ),
    ).toEqual(and(inClause('primary_site', ['Brain', 'Lung', 'Skin'])));
  });

  it('leaves the value order of a clause it did not merge alone', () => {
    expect(
      addInSQON(and(inClause('primary_site', ['Skin', 'Lung'])), and(inClause('gender', ['F']))),
    ).toEqual(and(inClause('gender', ['F']), inClause('primary_site', ['Skin', 'Lung'])));
  });

  it('orders clauses by field name', () => {
    expect(addInSQON(and(inClause('zeta', ['1'])), and(inClause('alpha', ['2'])))).toEqual(
      and(inClause('alpha', ['2']), inClause('zeta', ['1'])),
    );
  });

  it('keeps clauses on one field apart when their operators differ', () => {
    const gte = { op: 'gte', content: { fieldName: 'age', value: 3 } };

    // Their relative order is not asserted: `sortClauses` ranks equal field names equally, so it
    // falls out of insertion order rather than being intended.
    const { content } = addInSQON(and(inClause('age', ['5'])), and(gte));

    expect(content).toHaveLength(2);
    expect(content).toEqual(expect.arrayContaining([inClause('age', ['5']), gte]));
  });

  it('merges one field while leaving the others intact', () => {
    expect(
      addInSQON(
        and(inClause('gender', ['F']), inClause('primary_site', ['Lung'])),
        and(inClause('primary_site', ['Breast'])),
      ),
    ).toEqual(and(inClause('gender', ['F']), inClause('primary_site', ['Breast', 'Lung'])));
  });
});

describe('removeSQON', () => {
  it('removes every clause filtering on the field', () => {
    expect(
      removeSQON(
        'expanded',
        and(inClause('expanded', ['true']), inClause('primary_site', ['Lung'])),
      ),
    ).toEqual(and(inClause('primary_site', ['Lung'])));
  });

  it('returns null once nothing is left', () => {
    expect(removeSQON('expanded', and(inClause('expanded', ['true'])))).toBeNull();
  });

  it('leaves a SQON without that field unchanged', () => {
    expect(removeSQON('expanded', and(inClause('primary_site', ['Lung'])))).toEqual(
      and(inClause('primary_site', ['Lung'])),
    );
  });

  it('returns null for a missing SQON', () => {
    expect(removeSQON('expanded', null)).toBeNull();
  });

  it('returns an empty SQON untouched', () => {
    expect(removeSQON('expanded', {})).toEqual({});
  });
});

describe('filterExpanded', () => {
  const sqon = and(inClause('expanded', ['true']), inClause('primary_site', ['Lung']));

  it('strips the expanded filter by default', () => {
    expect(filterExpanded(sqon)).toEqual(and(inClause('primary_site', ['Lung'])));
  });

  it('keeps it when expanded status is being shown', () => {
    expect(filterExpanded(sqon, true)).toEqual(sqon);
  });
});

describe('toggleExpanded', () => {
  const sqon = and(inClause('primary_site', ['Lung']));

  it('restricts to expanded models by default', () => {
    expect(toggleExpanded(sqon)).toEqual(
      and(inClause('expanded', ['true']), inClause('primary_site', ['Lung'])),
    );
  });

  it('strips the expanded filter when unexpanded models are wanted', () => {
    expect(
      toggleExpanded(and(inClause('expanded', ['true']), inClause('primary_site', ['Lung'])), true),
    ).toEqual(sqon);
  });
});

describe('getNumUnexpanded', () => {
  it('queries the current search restricted to unexpanded models', async () => {
    let sent;
    const apiFetcher = async ({ body }) => {
      sent = body.variables.filters;
      return { data: { model: { hits: { total: 7 } } } };
    };

    const total = await getNumUnexpanded(
      and(inClause('expanded', ['true']), inClause('primary_site', ['Lung'])),
      apiFetcher,
    );

    expect(total).toBe(7);
    expect(sent).toEqual(and(inClause('expanded', ['false']), inClause('primary_site', ['Lung'])));
  });

  it('falls back to zero when the response carries no total', async () => {
    expect(await getNumUnexpanded(and(inClause('primary_site', ['Lung'])), async () => ({}))).toBe(
      0,
    );
  });
});
