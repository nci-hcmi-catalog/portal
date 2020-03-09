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
      Has Multiple Models
    </span>
    <AggregationQuery sqon={sqon} field="has_matched_models">
      {({ state }) => {
        console.log(state.buckets);
        console.log(state.extended);
        return state.loading ? (
          'loading'
        ) : (
          <>
            <ResponsivePie
              margin={{
                top: 12,
                right: 12,
                bottom: 12,
                left: 12,
              }}
              data={state.buckets.map((x, i) => ({
                id: x.key,
                label: state.extended.displayValues[x.key_as_string],
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
                            field: 'has_matched_models',
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
