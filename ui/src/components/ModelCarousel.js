import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

import { Row } from 'theme/system';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import ArrowRightIcon from 'icons/ArrowRightIcon';
import { SavedSetsContext } from 'providers/SavedSets';

export default ({ modelName, sqon }) => {
  const {
    fetchSets,
    state: { loading, sets },
  } = useContext(SavedSetsContext);
  const items =
    (sets[(sqon || { content: { value: '' } }).content.value.replace('set_id', '')] || { ids: [] })
      .ids || [];
  const currentIndex = items.indexOf(modelName);
  const prevName = items[currentIndex - 1] || items[items.length - 1] || '';
  const nextName = items[currentIndex + 1] || items[0] || '';

  useEffect(() => {
    if (items.length === 0) {
      fetchSets({ sqon });
    }
  }, []);

  return (
    <Row
      className="pagination"
      css={loading ? 'pointer-events: none; pointer: not-allowed;' : ''}
      justifyContent="space-between"
    >
      <Link
        to={{
          pathname: `/model/${prevName}`,
          search: stringify({ sqon: JSON.stringify(sqon) }),
        }}
        className="pagination__item pagination__link"
        css={`
          opacity: ${loading || !prevName ? '0.5' : '1'};
          pointer-events: ${loading || !prevName ? 'none' : 'inherit'};
        `}
      >
        <ArrowLeftIcon
          css={`
            opacity: ${loading ? '0.5' : '1'};
          `}
          fill={'#990000'}
        />
        <span>Previous</span>
      </Link>
      <Row
        className="pagination__item pagination__status"
        css={`
          opacity: ${loading ? '0.5' : '1'};
        `}
        justifyContent="center"
      >
        Model {currentIndex + 1} of {items.length.toLocaleString()}
      </Row>
      <Link
        to={{
          pathname: `/model/${nextName}`,
          search: stringify({ sqon: JSON.stringify(sqon) }),
        }}
        className="pagination__item pagination__link"
        css={`
          opacity: ${loading || !nextName ? '0.5' : '1'};
          pointer-events: ${loading || !nextName ? 'none' : 'inherit'};
        `}
      >
        <span>Next</span>
        <ArrowRightIcon
          css={`
            margin-left: 5px;
            margin-right: 0;
            opacity: ${loading ? '0.5' : '1'};
          `}
          fill={'#990000'}
        />
      </Link>
    </Row>
  );
};
