import React from 'react';
import { Row, Col } from 'theme/system';
import Spinner from 'react-spinkit';
import { QuickSearch } from '@arranger/components/dist/Arranger';
import TextInput from './TextInput';

export default (
  { props, ...rest }, // super subtle bug due to `props` name collision
) => (
  <div // display: flex is causing this component to have zero height for reasons I do not understand.
    className="model-name-search-wrapper aggregation-card"
  >
    <Row className="header">
      <Row className="title-wrapper">
        <span className="arrow" />
        <span className="title">Search by Name</span>
      </Row>
    </Row>
    <Col className="model-name-search-content-wrapper" p={2}>
      <Row className="model-name-search-content" alignItems="center">
        <QuickSearch
          {...rest}
          placeholder="Enter model name ..."
          searchTextDelimiters={[',']}
          InputComponent={TextInput}
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
