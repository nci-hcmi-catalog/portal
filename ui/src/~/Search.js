import React from 'react';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import Url from '~/Url';
import { Row } from '~/Layout';

export default props => (
  <Url
    render={url => {
      return (
        <Arranger
          {...props}
          projectId={props.version}
          render={props => {
            return (
              <div>
                <Row>
                  <Aggregations
                    {...{
                      ...props,
                      setSQON: url.setSQON,
                      index: 'models',
                      graphqlField: 'models',
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 30,
                    }}
                  >
                    <div
                      css={`
                        display: flex;
                      `}
                    >
                      <CurrentSQON {...props} {...url} index="models" graphqlField="models" />
                    </div>
                    <Table
                      {...props}
                      {...url}
                      index="models"
                      graphqlField="models"
                      columnDropdownText="Columns"
                      fieldTypesForFilter={['text', 'keyword', 'id']}
                    />
                  </div>
                </Row>
              </div>
            );
          }}
        />
      );
    }}
  />
);
