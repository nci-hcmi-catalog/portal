import React from 'react';
import { injectGlobal as css } from 'emotion';
import { Link } from 'react-router-dom';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import Url from '~/Url';
import { Row } from '~/Layout';

css`
  .ReactTable .rt-resizable-header-content {
    color: #900;
  }

  .ReactTable.-striped .rt-tr.-odd {
    background-color: #fff2cc;
  }

  .ReactTable .rt-thead {
    background-color: #ffffff;
  }

  .sqon-view {
    background-color: #ffffff;
    border: 1px solid #d4d6dd;
    padding: 4px 19px 14px;
  }

  .sqon-value {
    background-color: #900;
    color: #fff;
    padding: 0 7px 0 12px;
    margin-right: 4px;
    cursor: pointer;
  }

  .aggregation-card .title-wrapper .title {
    color: #900;
    font-weight: bolder;
    font-size: 0.9rem;
    font-family: Open Sans, sans-serif;
  }

  .aggregation-card {
    border-left-color: #774928 !important;
  }
`;

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
                      customTypes={{
                        entity: ({ value }) => <Link to={`/model/${value}`}>{value}</Link>,
                      }}
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
