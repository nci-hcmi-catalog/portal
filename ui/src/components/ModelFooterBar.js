import React from 'react';
import { Row } from 'theme/system';

import Url from 'components/Url';
import ModelCarousel from 'components/ModelCarousel';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';

import BackToSearch from 'components/links/BackToSearch';

import { brandPrimaryColourHover } from 'theme/hoverStyles';

export default ({ name }) => (
  <Url
    render={({ sqon, history }) => (
      <Row className="model-footer-bar">
        <BackToSearch
          sqon={sqon}
          history={history}
          css={`
            display: flex;
            flex-direction: row;
            align-items: center;
            ${brandPrimaryColourHover};
            font-family: 'Open Sans', sans-serif;
            padding-right: 20px;
            width: 30%;
            cursor: pointer;
          `}
        >
          <ArrowLeftIcon /> Back to Search
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
