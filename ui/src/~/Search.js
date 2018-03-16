import React from 'react';
import { Link } from 'react-router-dom';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import searchStyles from '~/searchStyles';
import Url from '~/Url';
import { Row, Col } from '~/Layout';

export default props => (
  <Url
    render={url => {
      return (
        <Arranger
          {...props}
          projectId={props.version}
          render={props => {
            return (
              <Row css={searchStyles}>
                <Aggregations {...props} {...url} index="models" graphqlField="models" />
                <Col p={30} flex={1}>
                  <Row>
                    <CurrentSQON {...props} {...url} index="models" graphqlField="models" />
                  </Row>
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
                </Col>
              </Row>
            );
          }}
        />
      );
    }}
  />
);
