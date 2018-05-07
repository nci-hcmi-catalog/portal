import React from 'react';
import { VictoryPie, VictoryTooltip } from 'victory';
import { sortBy } from 'lodash';
import AggregationQuery from 'components/Queries/AggregationQuery';
import { Col } from 'theme/system';
import theme from 'theme';

export default ({ sqon }) => (
  <Col
    alignItems="center"
    css={`
      position: relative;
    `}
  >
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
          <>
            <div
              className="pie-center sqon-field"
              css={`
                position: absolute;
                top: 50%;
                font-size: 10px;
              `}
            >
              {sortBy(state.buckets, x => x.doc_count)[0].key}
              <div
                css={`
                  font-size: 12px;
                  text-align: center;
                  margin-top: 4px;
                `}
              >
                {sortBy(state.buckets, x => x.doc_count)[0].doc_count}
              </div>
            </div>
            <VictoryPie
              labelComponent={<VictoryTooltip />}
              style={{
                labels: {
                  fontSize: 40,
                },
              }}
              innerRadius={102}
              colorScale={theme.palette}
              data={state.buckets.map(x => ({
                x: x.key,
                y: x.doc_count,
                label: `${x.key}\n${x.doc_count} Models`,
              }))}
            />
          </>
        );
      }}
    </AggregationQuery>
  </Col>
);
