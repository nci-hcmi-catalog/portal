import React from 'react';
import { range } from 'lodash';
import { ResponsiveBar } from '@nivo/bar';
import AggregationQuery from 'components/Queries/AggregationQuery';
import { Col } from 'theme/system';
import theme from 'theme';
import { toggleSQON } from '@arranger/components/dist/SQONView/utils';
import { ChartTooltip } from './';

const yGridSizes = [10, 100, 1000];

export default ({ sqon, setSQON }) => (
  <Col
    alignItems="center"
    css={`
      position: relative;
      width: 50%;
    `}
  >
    <AggregationQuery sqon={sqon} field="variants__name">
      {({
        state,
        top10 = (state.buckets || [])
          .sort((a, b) => b.doc_count - a.doc_count)
          .slice(0, 10)
          .map((bucket, i) => ({
            ...bucket,
            color: theme.palette[i],
          })),
        largestCount = top10.reduce(
          (largest, { doc_count }) => (doc_count > largest ? doc_count : largest),
          0,
        ),
        yGridStepSize = yGridSizes.reduce(
          (gridSize, possible) => (largestCount > possible ? possible : gridSize),
          10,
        ),
        yGridValues = range(
          0,
          largestCount + yGridStepSize * 2, //ensure that largest will be in the range
          yGridStepSize,
        ),
      }) => {
        return state.loading ? (
          'loading'
        ) : (
          <>
            <span
              className="sqon-field"
              css={`
                font-size: 12px;
              `}
            >
              Top {top10.length} Variants in {state.total} Models
              {console.log(yGridStepSize)}
              {console.log(yGridValues)}
            </span>
            <ResponsiveBar
              margin={{
                top: 25,
                right: 15,
                bottom: 38,
                left: 60,
              }}
              data={top10}
              enableLabel={false}
              padding={0.4}
              indexBy="key"
              keys={['doc_count']}
              colorBy={data => {
                return (data || { data: { color: 'white' } }).data.color;
              }}
              axisBottom={{
                orient: 'bottom',
                tickSize: 3,
                tickPadding: 2,
                tickRotation: -45,
                legendOffset: 50,
                format: value => (value.length >= 4 ? `${value.substring(0, 4)}\u2026` : value),
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: 'center',
                legendOffset: -45,
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
                  toggleSQON(
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
    </AggregationQuery>
  </Col>
);
