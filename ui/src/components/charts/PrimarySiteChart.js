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
      width: 48%; /* 25% when there are three charts */
      max-width: 360px;
      height: 185px;
      padding: 16px 0 16px 0;
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
                transform: translateY(-10px);
                font-size: 14px;
                text-align: center;
              `}
            >
              {state.buckets.length}
              <div
                css={`
                  font-size: 10px;
                  text-align: center;
                  margin-top: 4px;
                `}
              >
                Primary<br />Sites
              </div>
            </div>
            <ResponsivePie
              margin={{
                top: 12,
                right: 12,
                bottom: 12,
                left: 12,
              }}
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
            />
          </>
        );
      }}
    </AggregationQuery>
  </Col>
);
