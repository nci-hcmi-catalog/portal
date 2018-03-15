import React from 'react';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import Url from './Url';

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
                <div>
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
                </div>
              </div>
            );
          }}
        />
      );
    }}
  />
);
