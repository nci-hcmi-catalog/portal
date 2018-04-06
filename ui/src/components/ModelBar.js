import React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'components/Layout';

import ArrowLeftIcon from 'icons/ArrowLeftIcon';

export default ({ name }) => (
  <div>
    <div
      css={`
        height: 6px;
        box-shadow: 0 0 4.9px 0.1px #bbbbbb;
        background-color: #ffffff;
        border: solid 1px #e0e1e6;
      `}
    />

    <Row className="model-bar">
      <h2>Model {name}</h2>
      <Row alignItems="center">
        <Link to="/">
          <ArrowLeftIcon height={9} width={5} /> Back to Search
        </Link>
        <Row className="pagination">pagination placeholder</Row>
      </Row>
      <div>download buttons</div>
    </Row>
  </div>
);
