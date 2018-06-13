import React from 'react';

import { Row } from 'theme/system';
import ModelCarousel from 'components/ModelCarousel';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import Url from 'components/Url';
import BackToSearch from 'components/links/BackToSearch';

export default ({ name, id }) => (
  <Url
    render={({ sqon, history }) => (
      <>
        <div
          css={`
            height: 6px;
            background-color: #ffffff;
          `}
        />

        <Row
          className="model-bar"
          css={`
            align-items: center;
            justify-content: space-between;
          `}
        >
          <h2>Model {name}</h2>
          {sqon && (
            <ModelCarousel
              modelName={name}
              sqon={sqon}
              css={`
                width: 40%;
              `}
            />
          )}
          <BackToSearch sqon={sqon} history={history}>
            <ArrowLeftIcon height={9} width={5} /> BACK TO SEARCH
          </BackToSearch>
        </Row>
      </>
    )}
  />
);
