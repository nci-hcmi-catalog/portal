import React from 'react';
import Component from 'react-component-component';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import searchStyles from 'theme/searchStyles';
import Url from 'components/Url';
import Quicksearch from 'components/Quicksearch';
import PrimarySiteChart from 'components/PrimarySiteChart';
import GrowthChart from 'components/GrowthChart';
import TableEntity from 'components/TableEntity';
import { Row, Col } from 'theme/system';
import { SavedSetsContext } from 'providers/SavedSets';
import { SelectedModelsContext } from 'providers/SelectedModels';

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
                            height: 185px;
                            padding: 16px;
                          `}
                        >
                          <PrimarySiteChart sqon={sqon} />
                          <GrowthChart sqon={sqon} />
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
                        <SelectedModelsContext.Consumer>
                          {selected => {
                            return (
                              <Table
                                {...props}
                                setSelectedTableRows={selectedRows =>
                                  selected.setModels({ models: selectedRows })
                                }
                                keepSelectedOnPageChange={true}
                                initalSelectedTableRows={selected.state.models}
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
                            );
                          }}
                        </SelectedModelsContext.Consumer>
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
