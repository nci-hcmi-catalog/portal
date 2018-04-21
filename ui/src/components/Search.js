import React from 'react';
import { Link } from 'react-router-dom';
import { Arranger, Aggregations, CurrentSQON, Table } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import searchStyles from 'theme/searchStyles';
import Url from 'components/Url';
import moment from 'moment';
import { Row, Col } from 'theme/system';

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
                <Col p={1} flex={1}>
                  <Col p={30} bg="#f4f5f7">
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
                      exportTSVFilename={`${props.index}-table-${moment().format(
                        'YYYY-MM-DD',
                      )}.tsv`}
                    />
                  </Col>
                </Col>
              </Row>
            );
          }}
        />
      );
    }}
  />
);
