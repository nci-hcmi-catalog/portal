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
        box-shadow: 0 0 4.9px 0.1px #bbbbbb;
        background-color: #ffffff;
        border: solid 1px #e0e1e6;
      `}
    />

    <Row className="model-bar">
      <Row
        css={`
          align-items: center;
          justify-content: space-between;
          width: 30%;
          padding-right: 6px;
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
