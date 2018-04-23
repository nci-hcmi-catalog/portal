import React from 'react';
import Component from 'react-component-component';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import { VictoryChart, VictoryBar, VictoryPie } from 'victory';

import searchStyles from 'theme/searchStyles';
import Url from 'components/Url';
import Quicksearch from 'components/Quicksearch';
import TableEntity from 'components/TableEntity';
import { Row, Col } from 'theme/system';
import { SavedSetsContext } from 'providers/SavedSets';

export default props => (
  <Component initalState={{ sorted: [] }}>
    {({ setState, state }) => (
      <Url
        render={({ sqon, setSQON, history }) => (
          <SavedSetsContext.Consumer>
            {savedSetsContext => (
              <Arranger
                {...props}
                projectId={props.version}
                render={props => {
                  return (
                    <Row css={searchStyles}>
                      <Col className="aggregations-wrapper">
                        <Quicksearch {...{ ...props, setSQON }} />
                        <Aggregations
                          {...props}
                          sqon={sqon}
                          setSQON={setSQON}
                          index={props.index}
                          graphqlField={props.index}
                          Wrapper={props => <React.Fragment {...props} />}
                        />
                      </Col>
                      <Col className="search-results-wrapper" p={30} flex={1}>
                        <Row
                          bg="white"
                          css={`
                            height: 170px;
                            padding: 16px;
                          `}
                        >
                          <Col alignItems="center">
                            <span
                              className="sqon-field"
                              css={`
                                font-size: 12px;
                              `}
                            >
                              Models by Primary Site
                            </span>
                            <VictoryPie
                              style={{
                                labels: {
                                  display: 'none',
                                },
                              }}
                              innerRadius={100}
                              colorScale={['#ee7f6d', '#e96535', '#f5b464']}
                              data={[
                                { x: 'Cats', y: 35 },
                                { x: 'Dogs', y: 40 },
                                { x: 'Birds', y: 55 },
                              ]}
                            />
                          </Col>
                          <Col alignItems="center">
                            {' '}
                            <span
                              className="sqon-field"
                              css={`
                                font-size: 12px;
                              `}
                            >
                              Top Variants
                            </span>
                            <VictoryChart domainPadding={100}>
                              <VictoryBar
                                style={{
                                  data: {
                                    fill: d => {
                                      return ['#ee7f6d', '#e96535', '#f5b464'][d.eventKey % 3];
                                    },
                                  },
                                }}
                                data={[
                                  { x: 'Cats', y: 55 },
                                  { x: 'Dogs', y: 40 },
                                  { x: 'Birds', y: 35 },
                                ]}
                              />
                            </VictoryChart>
                          </Col>
                          <Col alignItems="center">
                            {' '}
                            <span
                              className="sqon-field"
                              css={`
                                font-size: 12px;
                              `}
                            >
                              2D versus 3D Growth
                            </span>
                            <VictoryPie
                              style={{
                                labels: {
                                  display: 'none',
                                },
                              }}
                              innerRadius={100}
                              colorScale={['#ee7f6d', '#e96535', '#f5b464']}
                              data={[
                                { x: 'Cats', y: 35 },
                                { x: 'Dogs', y: 40 },
                                { x: 'Birds', y: 55 },
                              ]}
                            />
                          </Col>
                        </Row>
                        <Row>
                          {!sqon && (
                            <Row
                              css={`
                                line-height: 50px;
                                padding: 0 14px;
                                background-color: white;
                                flex: 1;
                              `}
                            >
                              <span
                                className="sqon-field"
                                css={`
                                  font-size: 12px;
                                  color: #d0d0d0ab;
                                `}
                              >
                                FILTERS
                              </span>
                            </Row>
                          )}
                          <CurrentSQON
                            {...props}
                            sqon={sqon}
                            setSQON={setSQON}
                            index={props.index}
                            graphqlField={props.index}
                          />
                        </Row>
                        <Table
                          {...props}
                          loading={savedSetsContext.state.loading || props.loading}
                          sqon={sqon}
                          setSQON={setSQON}
                          onSortedChange={sorted => setState({ sorted })}
                          alwaysSorted={[{ field: 'name', order: 'asc' }]}
                          customTypes={{
                            entity: props => (
                              <TableEntity
                                {...props}
                                savedSetsContext={savedSetsContext}
                                state={state}
                                sqon={sqon}
                                history={history}
                              />
                            ),
                          }}
                          index={props.index}
                          graphqlField={props.index}
                          columnDropdownText="Columns"
                          fieldTypesForFilter={['text', 'keyword', 'id']}
                        />
                      </Col>
                    </Row>
                  );
                }}
              />
            )}
          </SavedSetsContext.Consumer>
        )}
      />
    )}
  </Component>
);
