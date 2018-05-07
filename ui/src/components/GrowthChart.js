import React from 'react';
import { groupBy, sumBy } from 'lodash';
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
      2D versus 3D Growth
    </span>
    <AggregationQuery sqon={sqon} field="model_type">
      {({ state }) => {
        return state.loading ? (
          'loading'
        ) : (
          <VictoryPie
            padAngle={3}
            labelComponent={<VictoryTooltip />}
            style={{
              labels: {
                fontSize: 40,
              },
            }}
            innerRadius={100}
            colorScale={[theme.palette[2], theme.palette[6]]}
            data={Object.entries(groupBy(state.buckets, x => x.key.slice(0, 3))).map(([k, v]) => ({
              x: k,
              y: sumBy(v, x => x.doc_count),
              label: `${k} Growth\n${sumBy(v, x => x.doc_count)} Models`,
            }))}
          />
        );
      }}
    </AggregationQuery>
  </Col>
);
