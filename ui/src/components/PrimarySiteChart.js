import React from 'react';
import { VictoryPie, VictoryTooltip } from 'victory';
import AggregationQuery from 'components/Queries/AggregationQuery';
import { Col } from 'theme/system';
import theme from 'theme';

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
            labelComponent={<VictoryTooltip />}
            style={{
              labels: {
                fontSize: 40,
              },
            }}
            innerRadius={100}
            colorScale={theme.palette}
            data={state.buckets.map(x => ({
              x: x.key,
              y: x.doc_count,
              label: `${x.key}\n${x.doc_count} Models`,
            }))}
          />
        );
      }}
    </AggregationQuery>
  </Col>
);
