/* eslint-disable */
import React from 'react';
import { addInSQON } from '@arranger/components/dist/SQONView/utils';
import AggregationQuery from 'components/queries/AggregationQuery';
import { Col } from 'theme/system';
import theme from 'theme';
import { ResponsivePie } from '@nivo/pie';
import { ChartTooltip } from './';

export default ({ sqon, setSQON, victoryRef = React.createRef() }) => (
  <Col
    alignItems="center"
    css={`
      position: relative;
      height: 185px;
      width: 33%;
      padding: 12px 0 4px;
    `}
  >
    <span className="sqon-field sqon-field--chart-title">
      Models by Primary Site
    </span>
    <AggregationQuery sqon={sqon} field="primary_site">
      {({ state }) => {
        return state.loading ? (
          'loading'
        ) : (
          <>
            <div className="pie-center sqon-field">
              {state.buckets.length}
              <div>Total</div>
            </div>
            <ResponsivePie
              margin={{
                top: 12,
                right: 12,
                bottom: 12,
                left: 12,
              }}
              height={156}
              data={state.buckets.map((x, i) => ({
                id: x.key,
                label: x.key,
                value: x.doc_count,
                color: theme.chartsPalette[i % theme.chartsPalette.length],
              }))}
              tooltip={({ value, label }) => ChartTooltip({ value, label })}
              colors={theme.chartsPalette}
              colorBy={({ color }) => color}
              theme={theme.chart}
              innerRadius={0.7}
              enableRadialLabels={false}
              enableSlicesLabels={false}
              slicesLabelsSkipAngle={10}
              animate={false}
              onClick={data =>
                setSQON(
                  addInSQON(
                    {
                      op: 'and',
                      content: [
                        {
                          op: 'in',
                          content: {
                            field: 'primary_site',
                            value: [].concat(data.id || []),
                          },
                        },
                      ],
                    },
                    sqon,
                  ),
                )
              }
              onMouseEnter={(_data, event) => {
                event.currentTarget.style.cursor = 'pointer'
              }}
              onMouseLeave={(_data, event) => {
                event.currentTarget.style.cursor = 'auto'
              }}
        />
          </>
        );
      }}
    </AggregationQuery>
  </Col>
);
