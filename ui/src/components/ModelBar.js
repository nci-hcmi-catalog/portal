import React from 'react';

import { Row } from 'theme/system';
import ModelCarousel from 'components/ModelCarousel';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import ShareButton from 'components/ShareButton';
import Url from 'components/Url';
import BackToSearch from 'components/links/BackToSearch';
import { SelectedModelsContext } from 'providers/SelectedModels';

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
            <BackToSearch sqon={sqon} history={history}>
              <ArrowLeftIcon height={9} width={5} /> BACK TO SEARCH
            </BackToSearch>
          </Row>
          {sqon && (
            <ModelCarousel
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
            <SelectedModelsContext.Consumer>
              {selected => (
                <div
                  className="pill"
                  onClick={() => selected.toggleModel(id)}
                  style={{ marginRight: '10px' }}
                >
                  <input type="checkbox" checked={selected.state.models.includes(id)} />
                  Select for Download
                </div>
              )}
            </SelectedModelsContext.Consumer>

            <ShareButton
              link={`${window.location.origin}/model/${name}`}
              quote={`HCMI Model ${name}`}
            />
          </Row>
        </Row>
      </>
    )}
  />
);
