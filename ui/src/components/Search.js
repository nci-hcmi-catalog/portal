import React from 'react';
import Component from 'react-component-component';
import Spinner from 'react-spinkit';
import {
  Arranger,
  Aggregations,
  CurrentSQON,
  Table,
  QuickSearch,
} from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';

import searchStyles from 'theme/searchStyles';
import Url from 'components/Url';
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
                        <Col className="aggregations">
                          <Col className="aggregation-card">
                            <Row className="header">
                              <Row className="title-wrapper">
                                <span className="arrow" />
                                <span className="title">Quicksearch</span>
                              </Row>
                            </Row>
                            <QuickSearch
                              {...{ ...props, setSQON }}
                              placeholder="Enter Identifiers"
                              LoadingIcon={
                                <Spinner
                                  fadeIn="none"
                                  name="circle"
                                  color="#a9adc0"
                                  style={{ width: 15, height: 15 }}
                                />
                              }
                            />
                          </Col>
                        </Col>
                        <Aggregations
                          {...props}
                          sqon={sqon}
                          setSQON={setSQON}
                          index={props.index}
                          graphqlField={props.index}
                        />
                      </Col>
                      <Col className="search-results-wrapper" p={30} flex={1}>
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
                                  color: #eee;
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
