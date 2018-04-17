import React from 'react';
import { Link } from 'react-router-dom';

import { Row } from 'theme/system';
import ModelPager from 'components/ModelPager';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import ShareButton from 'components/ShareButton';
import Url from 'components/Url';

export default ({ name }) => (
  <Url
    render={({ sqon }) => (
      <div>
        <div
          css={`
            height: 6px;
            background-color: #ffffff;
          `}
        />

        <Row className="model-bar">
          <Row
            css={`
              align-items: center;
              justify-content: space-between;
              width: 30%;
              padding-right: 20px;
            `}
          >
            <h2>Model {name}</h2>
            <Link to="/">
              <ArrowLeftIcon height={9} width={5} /> BACK TO SEARCH
            </Link>
          </Row>
          {sqon && (
            <ModelPager
              modelName={name}
              sqon={sqon}
              css={`
                width: 40%;
              `}
            />
          )}
          <Row
            css={`
              width: 30%;
              justify-content: flex-end;
            `}
          >
            <ShareButton
              link={`${window.location.origin}/model/${name}`}
              quote={`HCMI Model ${name}`}
            />
          </Row>
        </Row>
      </div>
    )}
  />
);
