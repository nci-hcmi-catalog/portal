import React from 'react';
import { range, isEqual } from 'lodash';
import { ResponsiveBar } from '@nivo/bar';
import Component from 'react-component-component';

import { Col } from 'theme/system';
import theme from 'theme';
import AggregationQuery from 'components/queries/AggregationQuery';
import { addInSQON } from '@arranger/components/dist/SQONView/utils';

import { ChartTooltip } from './';
const yGridSizes = [10, 100, 1000];

export default ({ sqon, setSQON }) => (
  <Col
    alignItems="center"
    css={`
      position: relative;
      width: 50%;
      height: 185px;
      padding: 16px 0 16px 0;
    `}
  >
    <AggregationQuery sqon={sqon} field="variants__name">
      {({ state: aggState }) => {
        return (
          <Component
            top10={(aggState.buckets || [])
              .sort((a, b) => {
                if (b.doc_count === a.doc_count) {
                  if (a.key > b.key) {
                    return 1;
                  }
                  if (a.key < b.key) {
                    return -1;
                  }
                  return 0;
                } else {
                  return b.doc_count - a.doc_count;
                }
              })
              .slice(0, 10)}
            initialState={{ coloredTop10: [] }}
            loading={aggState.loading}
            shouldUpdate={({ props, nextProps, state, nextState }) => {
              return (
                !isEqual(props.top10, nextProps.top10) ||
                !isEqual(state.coloredTop10, nextState.coloredTop10)
              );
            }}
            didUpdate={({ setState, props, prevState }) => {
              const byKey = prevState.coloredTop10.reduce(
                (acc, { key, color }) => ({ ...acc, [key]: color }),
                {},
              );
              const { coloredTop10 } = props.top10.reduce(
                (acc, bucket) => {
                  const color = byKey[bucket.key] || acc.palette[0];
                  const palette = acc.palette.filter(pColor => pColor !== color);
                  return {
                    coloredTop10: [
                      ...acc.coloredTop10,
                      {
                        ...bucket,
                        color,
                      },
                    ],
                    palette,
                  };
                },
                { coloredTop10: [], palette: theme.chartsPalette },
              );
              setState({
                coloredTop10,
              });
            }}
          >
            {({
              state: { coloredTop10, loading },
              largestCount = coloredTop10.reduce(
                (largest, { doc_count }) => (doc_count > largest ? doc_count : largest),
                0,
              ),
              yGridStepSize = yGridSizes.reduce(
                (gridSize, possible) => (largestCount > possible ? possible : gridSize),
                Math.floor(largestCount / 3), // y-axis step size minimum value
              ),
              yGridValues = largestCount > 0
                ? range(
                    0,
                    largestCount + yGridStepSize * 2, //ensure that largest will be in the range
                    yGridStepSize,
                  )
                : [],
            }) => {
              return loading ? (
                'loading'
              ) : (
                <>
                  <span
                    className="sqon-field"
                    css={`
                      font-size: 12px;
                    `}
                  >
                    Top {coloredTop10.length} Variants in {aggState.total} Models
                  </span>
                  <ResponsiveBar
                    margin={{
                      top: 25,
                      right: 15,
                      bottom: 38,
                      left: 60,
                    }}
                    data={coloredTop10}
                    enableLabel={false}
                    padding={0.4}
                    indexBy="key"
                    keys={['doc_count']}
                    colorBy={data => (data || { data: { color: 'white' } }).data.color}
                    axisBottom={{
                      orient: 'bottom',
                      tickSize: 3,
                      tickPadding: 2,
                      tickRotation: -45,
                      legendOffset: 50,
                      format: value =>
                        value.length >= 4 ? `${value.substring(0, 4)}\u2026` : value,
                    }}
                    axisLeft={{
                      orient: 'left',
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legendPosition: 'center',
                      legendOffset: -40,
                      legend: '# Models',
                      tickValues: yGridValues,
                    }}
                    enableGridY={true}
                    gridYValues={yGridValues}
                    theme={theme.chart}
                    tooltip={({ value, data }) => ChartTooltip({ value, label: data.key })}
                    isInteractive={true}
                    onClick={data =>
                      setSQON(
                        addInSQON(
                          {
                            op: 'and',
                            content: [
                              {
                                op: 'in',
                                content: {
                                  field: 'variants.name',
                                  value: [].concat(data.data.key || []),
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
          </Component>
        );
      }}
    </AggregationQuery>
  </Col>
);
