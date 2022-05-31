import React from 'react';
import { Row } from 'theme/system';

import Url from 'components/Url';
import ModelCarousel from 'components/ModelCarousel';

const ModelCarouselBar = ({ name, className }) => (
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

export default ModelCarouselBar;
