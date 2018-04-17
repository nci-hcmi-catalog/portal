import React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'theme/system';

import Url from 'components/Url';
import ModelPager from 'components/ModelPager';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';

export default ({ name }) => (
  <Url
    render={({ sqon }) => (
      <Row className="model-footer-bar">
        <Link
          to="/"
          css={`
            width: 30%;
          `}
        >
          <ArrowLeftIcon height={9} width={5} fill="#724c31" /> Back to Search
        </Link>
        {sqon && (
          <ModelPager
            modelName={name}
            sqon={sqon}
            css={`
              width: 40%;
            `}
          />
        )}
        <div
          css={`
            width: 30%;
          `}
        />
      </Row>
    )}
  />
);
