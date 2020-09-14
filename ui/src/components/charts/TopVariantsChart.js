import React from 'react';
import { isEqual } from 'lodash';
import { ResponsiveBar } from '@nivo/bar';
import Component from 'react-component-component';

import { Col } from 'theme/system';
import theme from 'theme';
import AggregationQuery from 'components/queries/AggregationQuery';
import { addInSQON } from '@arranger/components/dist/SQONView/utils';

import { ChartTooltip } from './';

export default ({ sqon, setSQON }) => (
  <Col
    alignItems="center"
    css={`
      position: relative;
      width: 25%;
      height: 185px;
      padding: 12px 0 4px;
    `}
  >
    <AggregationQuery sqon={sqon} field="gene_metadata__genes">
      {({ state: aggState }) => {
        return (
          <Component
            top10={(aggState.buckets || [])
              .filter(b => b.key !== '__missing__')
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
                { coloredTop10: [], palette: theme.mutatedGenesChartPalette },
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
              yGridValues = largestCount > 0 ? [0, largestCount] : [],
            }) => {
              return loading ? (
                <span className="sqon-field sqon-field--chart-title">Loading...</span>
              ) : (
                <>
                  <span className="sqon-field sqon-field--chart-title">
                    Most Frequently Mutated Genes
                  </span>
                  <ResponsiveBar
                    margin={{
                      top: 12,
                      right: 12,
                      bottom: 50,
                      left: 48,
                    }}
                    data={coloredTop10}
                    maxValue={largestCount}
                    enableLabel={false}
                    padding={0.4}
                    indexBy="key"
                    keys={['doc_count']}
                    colorBy={data => (data || { data: { color: 'white' } }).data.color}
                    axisBottom={{
                      tickSize: 0,
                      tickPadding: 5,
                      tickRotation: 45,
                      legendOffset: 50,
                      format: value => {
                        const cutoffLength = 6;
                        const dashIndex = value.indexOf('-');
                        const spaceIndex = value.indexOf(' ');

                        return value.substring(
                          0,
                          Math.min(
                            cutoffLength,
                            value.length,
                            dashIndex > 0 ? dashIndex : 999,
                            spaceIndex > 0 ? spaceIndex : 999,
                          ),
                        );
                      },
                    }}
                    axisLeft={{
                      orient: 'left',
                      tickSize: 0,
                      tickPadding: 5,
                      tickRotation: 0,
                      legendOffset: -40,
                      legendPosition: 'middle',
                      legend: '# models affected',
                      tickValues: yGridValues,
                    }}
                    enableGridY={false}
                    gridYValues={yGridValues}
                    theme={{
                      ...theme.chart,
                      axis: {
                        domain: {
                          line: {
                            stroke: '#dcdde1',
                            strokeWidth: 1,
                          },
                        },
                      },
                    }}
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
                                  field: 'gene_metadata.genes',
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
