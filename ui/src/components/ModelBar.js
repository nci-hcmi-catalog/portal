import React from 'react';
import { Link } from 'react-router-dom';

import { Row } from 'components/Layout';
import ModelPager from 'components/ModelPager';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';

export default ({ name }) => (
  <div>
    <div
      css={`
        height: 6px;
        background-color: #ffffff;
      `}
    />

    <Row className="model-bar">
      <Row
        css={`
          align-items: center;
          justify-content: space-between;
          width: 30%;
          padding-right: 20px;
        `}
      >
        <h2>Model {name}</h2>
        <Link to="/">
          <ArrowLeftIcon height={9} width={5} /> BACK TO SEARCH
        </Link>
      </Row>
      <ModelPager
        modelName={name}
        css={`
          width: 40%;
        `}
      />
      <Row
        css={`
          width: 30%;
          justify-content: flex-end;
        `}
      >
        download buttons
      </Row>
    </Row>
  </div>
);
