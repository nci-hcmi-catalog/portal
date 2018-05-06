import React from 'react';
import { Row, Col } from 'theme/system';
import Spinner from 'react-spinkit';
import { QuickSearch } from '@arranger/components/dist/Arranger';

export default props => (
  <div // display: flex is causing this component to have zero height for reasons I do not understand.
    className="quicksearch-wrapper aggregation-card"
  >
    <Row className="header">
      <Row className="title-wrapper">
        <span className="arrow" />
        <span className="title">Quicksearch</span>
      </Row>
    </Row>
    <Col className="quicksearch-content-wrapper" p={2}>
      <Row className="quicksearch-content" alignItems="center">
        <Row className="quicksearch-label">Name: </Row>
        <QuickSearch
          {...props}
          placeholder="Enter Identifiers"
          whitelist={['name']}
          LoadingIcon={
            <Spinner
              fadeIn="none"
              name="circle"
              color="#a9adc0"
              style={{ width: 15, height: 15 }}
            />
          }
        />
      </Row>
    </Col>
  </div>
);
