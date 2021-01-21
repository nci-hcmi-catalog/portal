/* eslint-disable */
import React from 'react';
import { groupBy, sumBy } from 'lodash';
import { ResponsivePie } from '@nivo/pie';
import AggregationQuery from 'components/queries/AggregationQuery';
import TwoDIcon from 'icons/TwoDIcon';
import ThreeDIcon from 'icons/ThreeDIcon';
import { Col } from 'theme/system';
import theme from 'theme';
import { ChartTooltip } from './';
import { addInSQON } from '@arranger/components/dist/SQONView/utils';
import { SizeMe } from 'react-sizeme';

const HAS_LABELS_WIDTH = 320;
export default ({ sqon, setSQON }) => (
  <SizeMe>
    {({ size }) => (
      <Col
        alignItems="center"
        css={`
          position: relative;
          height: 185px;
          width: 25%;
          padding: 12px 0 4px;
        `}
      >
        <span className="sqon-field sqon-field--chart-title">
          2D versus 3D Growth
        </span>
        <AggregationQuery sqon={sqon} field="type">
          {({
            state,
            data = Object.entries(groupBy(state.buckets || [], x => x.key.slice(0, 3))).map(
              ([k, v]) => ({
                id: k,
                value: sumBy(v, x => x.doc_count),
                label: `${k === 'Oth' ? 'Other' : k} Growth`,
                keys: v.map(x => x.key),
              }),
            ),
          }) => {
            return state.loading ? (
              'loading'
            ) : (
              <>
                {/* {size.width > HAS_LABELS_WIDTH && (
                  <Col
                    css={`
                      position: absolute;
                      top: 50%;
                      left: 10%;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    `}
                  >
                    <TwoDIcon
                      alt="2d growth"
                      css={`
                        fill: ${theme.growthChartPalette[1]};
                      `}
                    />
                    <span
                      css={`
                        margin-top: 4px;
                        font-weight: bold;
                        color: ${theme.growthChartPalette[1]};
                      `}
                    >
                      2D:
                      {Math.round(
                        (Object.entries(groupBy(state.buckets, x => x.key.slice(0, 3)))
                          .map(([k, v]) => ({
                            key: k,
                            total: sumBy(v, x => x.doc_count),
                          }))
                          .find(x => x.key === '2-D')?.total || 0) /
                          state.total *
                          100, //eslint-disable-line
                      )}%
                    </span>
                  </Col>
                )} */}
                <ResponsivePie
                  margin={{
                    top: 12,
                    right: 12,
                    bottom: 12,
                    left: 12,
                  }}
                  height={156}
                  data={[
                    data.find(({ id }) => id === '3-D') || { id: '3-D', value: 0 },
                    data.find(({ id }) => id === '2-D') || { id: '2-D', value: 0 },
                    data.find(({ id }) => id !== '3-D' && id !== '2-D') || { id: 'Other', value: 0 },
                  ]}
                  colors={theme.growthChartPalette}
                  innerRadius={0.7}
                  enableRadialLabels={false}
                  enableSlicesLabels={false}
                  slicesLabelsSkipAngle={10}
                  animate={false}
                  tooltip={({ id, value, label }) => ChartTooltip({ value, label })}
                  theme={theme.chart}
                  onClick={data =>
                    setSQON(
                      addInSQON(
                        {
                          op: 'and',
                          content: [
                            {
                              op: 'in',
                              content: {
                                field: 'type',
                                value: (data.keys || []).sort(),
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
                {/* {size.width > HAS_LABELS_WIDTH && (
                  <Col
                    css={`
                      position: absolute;
                      top: 50%;
                      right: 10%;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    `}
                  >
                    <ThreeDIcon
                      alt="3d growth"
                      css={`
                        fill: ${theme.growthChartPalette[0]};
                      `}
                    />
                    <span
                      css={`
                        margin-top: 4px;
                        font-weight: bold;
                        color: ${theme.growthChartPalette[0]};
                      `}
                    >
                      3D:
                      {Math.round(
                        (Object.entries(groupBy(state.buckets, x => x.key.slice(0, 3)))
                          .map(([k, v]) => ({
                            key: k,
                            total: sumBy(v, x => x.doc_count),
                          }))
                          .find(x => x.key === '3-D')?.total || 0) /
                          state.total *
                          100,
                      )}%
                    </span>
                  </Col>
                )} */}
              </>
            );
          }}
        </AggregationQuery>
      </Col>
    )}
  </SizeMe>
);
