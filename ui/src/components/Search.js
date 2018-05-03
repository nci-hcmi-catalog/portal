import React from 'react';
import Component from 'react-component-component';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
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
                      <Aggregations
                        {...props}
                        sqon={sqon}
                        setSQON={setSQON}
                        index={props.index}
                        graphqlField={props.index}
                      />
                      <Col p={30} flex={1}>
                        <Row>
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
