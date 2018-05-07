import React from 'react';
import { VictoryPie } from 'victory';
import AggregationQuery from 'components/Queries/AggregationQuery';
import { Col } from 'theme/system';

export default ({ sqon }) => (
  <Col alignItems="center">
    <span
      className="sqon-field"
      css={`
        font-size: 12px;
      `}
    >
      Models by Primary Site
    </span>
    <AggregationQuery sqon={sqon} field="primary_site">
      {({ state }) => {
        return state.loading ? (
          'loading'
        ) : (
          <VictoryPie
            style={{
              labels: {
                display: 'none',
              },
            }}
            innerRadius={100}
            colorScale={['#ee7f6d', '#e96535', '#f5b464']}
            data={state.buckets.map(x => ({
              x: x.key,
              y: x.doc_count,
            }))}
          />
        );
      }}
    </AggregationQuery>
  </Col>
);
