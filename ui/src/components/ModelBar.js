import React from 'react';

import { Row } from 'theme/system';
import ModelCarousel from 'components/ModelCarousel';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import Url from 'components/Url';
import BackToSearch from 'components/links/BackToSearch';
import ModelList from 'components/ModelList';

export default ({ name, id }) => (
  <Url
    render={({ sqon, history }) => (
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

        <div className="model-bar-actions">
          <BackToSearch sqon={sqon} history={history}>
            <ArrowLeftIcon height={9} width={5} /> BACK TO SEARCH
          </BackToSearch>
          <ModelList className="model-bar-model-list" />
        </div>
      </Row>
    )}
  />
);
