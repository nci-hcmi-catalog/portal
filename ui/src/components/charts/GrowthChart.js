import React from 'react';
import { css } from '@emotion/react';
import { ResponsivePie } from '@nivo/pie';
import AggregationQuery from 'components/queries/AggregationQuery';
import { Col } from 'theme/system';
import theme from 'theme';
import { ChartTooltip } from './';
import { addInSQON } from '@arranger/components/dist/SQONView/utils';
import { SizeMe } from 'react-sizeme';

const is2d = bucket => bucket.key.slice(0, 3) === '2-D';
const is3d = bucket => bucket.key.slice(0, 3) === '3-D';
const isOther = bucket => bucket.key.match(/^[A-Z]/i);
const getCount = (buckets, filterBy) =>
  buckets.filter(filterBy).reduce((acc, curr) => acc + curr.doc_count, 0);
const getKeys = (buckets, filterBy) => buckets.filter(filterBy).map(x => x.key);

const GrowthChart = ({ sqon, setSQON }) => (
  <SizeMe>
    {({ size }) => (
      <Col
        alignItems="center"
        css={css`
          position: relative;
          height: 185px;
          width: 25%;
          padding: 12px 0 4px;
        `}
      >
        <span className="sqon-field sqon-field--chart-title">2D versus 3D Growth</span>
        <AggregationQuery sqon={sqon} field="type">
          {({
            state,
            data = [
              {
                id: '2-D',
                value: getCount(state.buckets || [], is2d),
                label: '2-D Growth',
                keys: getKeys(state.buckets || [], is2d),
              },
              {
                id: '3-D',
                value: getCount(state.buckets || [], is3d),
                label: '3-D Growth',
                keys: getKeys(state.buckets || [], is3d),
              },
              {
                id: 'Other',
                value: getCount(state.buckets || [], isOther),
                label: 'Other Growth',
                keys: getKeys(state.buckets || [], isOther),
              },
            ],
          }) => {
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
                  data={[
                    data.find(({ id }) => id === '3-D') || { id: '3-D', value: 0 },
                    data.find(({ id }) => id === '2-D') || { id: '2-D', value: 0 },
                    data.find(({ id }) => id === 'Other') || { id: 'Other', value: 0 },
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
                    event.currentTarget.style.cursor = 'pointer';
                  }}
                  onMouseLeave={(_data, event) => {
                    event.currentTarget.style.cursor = 'auto';
                  }}
                />
              </>
            );
          }}
        </AggregationQuery>
      </Col>
    )}
  </SizeMe>
);

export default GrowthChart;
