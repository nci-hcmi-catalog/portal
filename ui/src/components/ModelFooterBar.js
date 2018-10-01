import React from 'react';
import { Row } from 'theme/system';

import Url from 'components/Url';
import ModelCarousel from 'components/ModelCarousel';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';

import BackToSearch from 'components/links/BackToSearch';

export default ({ name }) => (
  <Url
    render={({ sqon, history }) => (
      <Row className="model-footer-bar">
        <BackToSearch
          sqon={sqon}
          history={history}
          css={`
            padding-right: 20px;
            width: 30%;
          `}
        >
          <ArrowLeftIcon height={9} width={5} fill="#724c31" /> Back to Search
        </BackToSearch>
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
