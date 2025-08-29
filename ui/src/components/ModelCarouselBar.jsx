import React from 'react';
import { Row } from '~/theme/system';

import Url from './Url';
import ModelCarousel from './ModelCarousel';

const ModelCarouselBar = ({ name, className }) => (
  <Url
    render={({ urlSqon }) => {
      return urlSqon ? (
        <Row className={`model-carousel-bar ${className}`}>
          <ModelCarousel modelName={name} urlSqon={urlSqon} />
        </Row>
      ) : null;
    }}
  />
);

export default ModelCarouselBar;
