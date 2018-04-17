import React from 'react';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';

import searchStyles from 'theme/searchStyles';
import { api } from '@arranger/components';
import Url from 'components/Url';
import { Row, Col } from 'theme/system';
import globals from 'utils/globals';
import { stringify } from 'query-string';
import Component from 'react-component-component';
import { SavedSetsContext } from 'providers/SavedSets';

const createSet = ({ sqon }) =>
  api({
    endpoint: `${globals.VERSION}/graphql`,
    body: {
      query: `
      mutation ($sqon: JSON!) {
        saveSet(sqon: $sqon type: "models" userId: "" path:"name") {
          sqon
          size
          userId
          setId
          ids
        }
      }`,
      variables: {
        sqon,
      },
    },
  });

export default props => (
  <Url
    render={({ sqon, setSQON, history }) => (
      <SavedSetsContext.Consumer>
        {savedSetsContext => (
          <Component
            initialState={{ creatingSet: false }}
            sqon={sqon}
            didUpdate={({ setState, props, prevProps }) => {
              if (props.sqon !== prevProps.sqon) {
                setState({ creatingSet: false });
              }
            }}
            render={({ state, setState }) => (
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
                          loading={state.creatingSet || props.loading}
                          sqon={sqon}
                          setSQON={setSQON}
                          customTypes={{
                            entity: ({ value }) => (
                              <div
                                className="clickable"
                                onClick={async () => {
                                  if (sqon) {
                                    setState({ creatingSet: true });
                                    const {
                                      data: {
                                        saveSet: { setId, ids },
                                      },
                                    } = await createSet({
                                      sqon,
                                    });
                                    setState({ creatingSet: false });
                                    savedSetsContext.setSet({ setId, ids });
                                    if (setId) {
                                      history.push({
                                        pathname: `/model/${value}`,
                                        search: stringify({
                                          sqon: JSON.stringify({
                                            op: 'in',
                                            content: { field: 'setId', value: setId },
                                          }),
                                        }),
                                      });
                                    }
                                    return;
                                  }
                                  history.push(`/model/${value}`);
                                }}
                              >
                                {value}
                              </div>
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
          />
        )}
      </SavedSetsContext.Consumer>
    )}
  />
);
