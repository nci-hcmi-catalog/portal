import React from 'react';

import { Row } from 'theme/system';
import ModelCarousel from 'components/ModelCarousel';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import Url from 'components/Url';
import BackToSearch from 'components/links/BackToSearch';
import ShareButton from 'components/ShareButton';
import { SelectedModelsContext } from 'providers/SelectedModels';
import ModelList from 'components/ModelList';

const ExpandedPill = ({ isExpanded }) => {
  return (
    <div className={`model-bar__pill model-bar__pill--${isExpanded ? 'expanded' : 'unexpanded'}`}>
      {isExpanded ? 'EXPANDED' : 'UNEXPANDED'}
    </div>
  );
};

export default ({ name, id, isExpanded }) => (
  <Url
    render={({ sqon, history }) => (
      <Row className="model-bar">
        <div className="model-bar__group">
          <h2 className="model-bar__heading">
            Model: <strong>{name}</strong>
          </h2>
          <ExpandedPill isExpanded={isExpanded} />
        </div>

        {sqon && <ModelCarousel modelName={name} sqon={sqon} />}

        <div className="model-bar__group">
          <BackToSearch sqon={sqon} history={history}>
            <ArrowLeftIcon /> BACK TO SEARCH
          </BackToSearch>
          <ShareButton
            link={`${window.location.origin}/model/${name}`}
            quote={`HCMI Model ${name}`}
          />
          <SelectedModelsContext.Consumer>
            {selected => {
              const isSelected = selected.state.modelIds.includes(id);
              return (
                <button
                  onClick={() => selected.toggleModel(id)}
                  className={`pill select-model ${isSelected ? 'selected' : ''}`}
                  style={{ marginLeft: '10px' }}
                >
                  {isSelected ? 'Selected for download' : 'Add model to my list'}
                </button>
              );
            }}
          </SelectedModelsContext.Consumer>
          <ModelList className="model-bar-model-list" />
        </div>
      </Row>
    )}
  />
);
