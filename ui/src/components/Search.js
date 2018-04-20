import React from 'react';
import { Link } from 'react-router-dom';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import searchStyles from 'utils/searchStyles';
import Url from 'components/Url';
import { Row, Col } from 'components/Layout';
import moment from 'moment';

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
                <Aggregations {...props} {...url} index={props.index} graphqlField={props.index} />
                <Col p={30} flex={1}>
                  <Row>
                    <CurrentSQON
                      {...props}
                      {...url}
                      index={props.index}
                      graphqlField={props.index}
                    />
                  </Row>
                  <Table
                    {...props}
                    {...url}
                    customTypes={{
                      entity: ({ value }) => <Link to={`/model/${value}`}>{value}</Link>,
                    }}
                    index={props.index}
                    graphqlField={props.index}
                    columnDropdownText="Columns"
                    fieldTypesForFilter={['text', 'keyword', 'id']}
                    exportTSVFilename={`${props.index}-table-${moment().format('YYYY-MM-DD')}.tsv`}
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
