import React from 'react';
import { Row } from 'theme/system';

import Url from 'components/Url';
import ModelCarousel from 'components/ModelCarousel';

export default ({ name }) => (
  <Url
    render={({ sqon, history }) => (
      <Row className="model-footer-bar">
        {sqon && <ModelCarousel modelName={name} sqon={sqon} />}
        <div
          css={`
            width: 30%;
          `}
        />
      </Row>
    )}
  />
);
