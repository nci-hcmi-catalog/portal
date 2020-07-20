import React from 'react';
import { Row } from 'theme/system';

import Url from 'components/Url';
import ModelCarousel from 'components/ModelCarousel';

export default ({ name, className }) => (
  <Url
    render={({ sqon }) => {
      return sqon ? (
        <Row className={`model-carousel-bar ${className}`}>
          <ModelCarousel modelName={name} sqon={sqon} />
        </Row>
      ) : null;
    }}
  />
);
