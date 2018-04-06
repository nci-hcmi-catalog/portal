import React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'components/Layout';

import ArrowLeftIcon from 'icons/ArrowLeftIcon';

export default ({ name }) => (
  <Row className="model-footer-bar">
    <Link to="/">
      <ArrowLeftIcon height={9} width={5} fill="#724c31" /> Back to Search
    </Link>
    <Row className="pagination">pagination placeholder</Row>
    <div />
  </Row>
);
