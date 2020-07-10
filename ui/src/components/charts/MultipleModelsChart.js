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
      Has Multiple Models
    </span>
    <AggregationQuery sqon={sqon} field="has_matched_models">
      {({ state }) => {
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
              height={156}
              data={state.buckets.map((x, i) => {
                return {
                  id: x.key,
                  key: x.key_as_string,
                  label: state.extended.displayValues[x.key_as_string],
                  value: x.doc_count,
                  color: theme.multipleModelsChartPalette[i % theme.multipleModelsChartPalette.length],
                };
              })}
              tooltip={({ value, label }) => ChartTooltip({ value, label })}
              colors={theme.multipleModelsChartPalette}
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
                            value: [data.key],
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
