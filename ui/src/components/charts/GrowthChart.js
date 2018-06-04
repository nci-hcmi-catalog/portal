/* eslint-disable */
import React from 'react';
import { groupBy, sumBy } from 'lodash';
import { ResponsivePie } from '@nivo/pie';
import AggregationQuery from 'components/Queries/AggregationQuery';
import TwoDIcon from 'assets/icon-2dimensions.svg';
import ThreeDIcon from 'assets/icon-3dimensions.svg';
import { Col } from 'theme/system';
import theme from 'theme';
import { ChartTooltip } from './';
import { toggleSQON } from '@arranger/components/dist/SQONView/utils';

export default ({ sqon, setSQON }) => (
  <Col
    alignItems="center"
    css={`
      position: relative;
      width: 25%;
      min-width: 382px;
    `}
  >
    <span
      className="sqon-field"
      css={`
        font-size: 12px;
      `}
    >
      2D versus 3D Growth
    </span>
    <AggregationQuery sqon={sqon} field="type">
      {({
        state,
        data = Object.entries(groupBy(state.buckets || [], x => x.key.slice(0, 3))).map(
          ([k, v]) => ({
            id: k,
            value: sumBy(v, x => x.doc_count),
            label: `${k} Growth`,
            keys: v.map(x => x.key),
          }),
        ),
      }) => {
        return state.loading ? (
          'loading'
        ) : (
          <>
            <Col
              css={`
                position: absolute;
                top: 50%;
                left: 10%;
              `}
            >
              <img
                src={TwoDIcon}
                alt="2d growth"
                css={`
                  height: 20px;
                `}
              />
              <span
                css={`
                  margin-top: 4px;
                  font-weight: bold;
                  color: ${theme.palette[6]};
                `}
              >
                2D:{' '}
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
            <ResponsivePie
              margin={{
                top: 12,
                right: 12,
                bottom: 12,
                left: 12,
              }}
              data={[
                data.find(({ id }) => id === '3-D'),
                data.find(({ id }) => id === '2-D'),
              ].filter(Boolean)}
              colors={[theme.palette[2], theme.palette[6]]}
              innerRadius={0.7}
              enableRadialLabels={false}
              enableSlicesLabels={false}
              slicesLabelsSkipAngle={10}
              animate={false}
              tooltip={({ id, value, label }) => ChartTooltip({ value, label })}
              theme={theme.chart}
              onClick={data =>
                setSQON(
                  toggleSQON(
                    {
                      op: 'and',
                      content: [
                        {
                          op: 'in',
                          content: {
                            field: 'type',
                            value: data.keys || [],
                          },
                        },
                      ],
                    },
                    sqon,
                  ),
                )
              }
            />
            <Col
              css={`
                position: absolute;
                top: 50%;
                right: 10%;
              `}
            >
              <img
                src={ThreeDIcon}
                alt="2d growth"
                css={`
                  height: 20px;
                `}
              />
              <span
                css={`
                  margin-top: 4px;
                  font-weight: bold;
                  color: ${theme.palette[2]};
                `}
              >
                3D:{' '}
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
          </>
        );
      }}
    </AggregationQuery>
  </Col>
);
