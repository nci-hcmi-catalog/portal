/* eslint-disable */

import React from 'react';
import { groupBy, sumBy } from 'lodash';
import { VictoryPie, VictoryTooltip } from 'victory';
import AggregationQuery from 'components/Queries/AggregationQuery';
import TwoDIcon from 'assets/icon-2dimensions.svg';
import ThreeDIcon from 'assets/icon-3dimensions.svg';
import { Col } from 'theme/system';
import theme from 'theme';

export default ({ sqon }) => (
  <Col
    alignItems="center"
    css={`
      position: relative;
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
      {({ state }) => {
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
            <VictoryPie
              sortOrder={
                Object.entries(groupBy(state.buckets, x => x.key.slice(0, 3)))
                  .map(([k, v]) => ({
                    key: k,
                    total: sumBy(v, x => x.doc_count),
                  }))
                  .find(x => x.key === '2-D')?.total ||
                0 >
                  Object.entries(groupBy(state.buckets, x => x.key.slice(0, 3)))
                    .map(([k, v]) => ({
                      key: k,
                      total: sumBy(v, x => x.doc_count),
                    }))
                    .find(x => x.key === '3-D')?.total ||
                0
                  ? 'ascending'
                  : 'descending'
              }
              padAngle={3}
              labelComponent={<VictoryTooltip />}
              style={{
                labels: {
                  fontSize: 40,
                },
              }}
              sortKey="y"
              innerRadius={100}
              colorScale={[theme.palette[2], theme.palette[6]]}
              data={Object.entries(groupBy(state.buckets, x => x.key.slice(0, 3))).map(
                ([k, v]) => ({
                  x: k,
                  y: sumBy(v, x => x.doc_count),
                  label: `${k} Growth\n${sumBy(v, x => x.doc_count)} Models`,
                }),
              )}
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
