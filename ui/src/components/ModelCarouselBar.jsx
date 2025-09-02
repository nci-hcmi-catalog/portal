import React from 'react';
import { Row } from '~/theme/system';

import WithUrlProps from './WithUrlProps';
import ModelCarousel from './ModelCarousel';

const ModelCarouselBar = ({ name, className }) => (
  <WithUrlProps
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
