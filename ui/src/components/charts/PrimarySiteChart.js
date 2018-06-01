/* eslint-disable */
import React from 'react';
import { toggleSQON } from '@arranger/components/dist/SQONView/utils';
import AggregationQuery from 'components/Queries/AggregationQuery';
import { Col } from 'theme/system';
import theme from 'theme';
import { ResponsivePie } from '@nivo/pie';

export default ({ sqon, setSQON, victoryRef = React.createRef() }) => (
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
                font-size: 10px;
                text-align: center;
              `}
            >
              {state.buckets
                .sort((a, b) => b.doc_count - a.doc_count)[0]
                ?.key.split(' ')
                .map((x, i) => <div key={i}>{x}</div>)}
              <div
                css={`
                  font-size: 12px;
                  text-align: center;
                  margin-top: 4px;
                `}
              >
                {state.buckets.sort((a, b) => b.doc_count - a.doc_count)[0]?.doc_count}
              </div>
            </div>
            <ResponsivePie
              margin={{
                top: 12,
                right: 12,
                bottom: 12,
                left: 12,
              }}
              data={state.buckets.map(x => ({
                id: x.key,
                value: x.doc_count,
              }))}
              tooltip={({ id, value }) => (
                <div>
                  {id}
                  <br />
                  {value} Models
                </div>
              )}
              theme={{
                tooltip: {
                  container: {
                    fontSize: '11px',
                    textAlign: 'center',
                  },
                },
              }}
              colors={theme.palette}
              innerRadius={0.7}
              enableRadialLabels={false}
              enableSlicesLabels={false}
              slicesLabelsSkipAngle={10}
              animate={false}
              onClick={data =>
                setSQON(
                  toggleSQON(
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
