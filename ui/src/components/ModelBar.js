import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

import { Row } from 'theme/system';
import { ButtonPill } from 'theme/adminControlsStyles';
import ArrowLeftIcon from 'icons/ArrowLeftIcon';
import CheckmarkIcon from 'icons/CheckmarkIcon';
import PlusIcon from 'icons/PlusIcon';
import Url from 'components/Url';
import { SavedSetsContext } from 'providers/SavedSets';
import { SelectedModelsContext } from 'providers/SelectedModels';
import ModelList from 'components/ModelList';

import { filterExpanded } from 'utils/sqonHelpers';

const ExpandedPill = ({ isExpanded }) => {
  return (
    <div className={`model-bar__pill model-bar__pill--${isExpanded ? 'expanded' : 'unexpanded'}`}>
      {isExpanded ? 'EXPANDED' : 'UNEXPANDED'}
    </div>
  );
};

const ModelBar = ({ name, id, isExpanded }) => {
  const {
    state: { sets },
  } = useContext(SavedSetsContext);
  const {
    state: { modelIds },
    toggleModel,
  } = useContext(SelectedModelsContext);
  const isSelected = modelIds.includes(id);

  const getBackRoute = (sqon) => {
    // need to avoid empty sqon object
    return sqon &&
      sqon.content &&
      sqon.content.value &&
      sets[sqon.content.value] &&
      sets[sqon.content.value].sqon &&
      Object.keys(sets[sqon.content.value].sqon).length !== 0
      ? {
          pathname: '/',
          search: stringify({
            sqon: JSON.stringify(filterExpanded(sets[sqon.content.value].sqon)),
          }),
        }
      : '/';
  };

  return (
    <Url
      render={({ sqon }) => (
        <Row className="model-bar">
          <div className="model-bar__group">
            <h2 className="model-bar__heading">
              Model: <strong>{name}</strong>
            </h2>
            <ExpandedPill isExpanded={isExpanded} />
          </div>

          <div className="model-bar__group">
            <Link className="model-bar__back" to={getBackRoute(sqon)}>
              <ArrowLeftIcon />
              BACK TO SEARCH
            </Link>

            <ButtonPill
              primary
              marginLeft={'8px'}
              onClick={() => toggleModel(id)}
              className={`model-bar__action ${isSelected ? 'model-bar__action--selected' : ''}`}
            >
              {isSelected ? (
                <>
                  <CheckmarkIcon />
                  Selected for Download
                </>
              ) : (
                <>
                  <PlusIcon />
                  Add Model to My List
                </>
              )}
            </ButtonPill>

            <ModelList className="model-bar-model-list" />
          </div>
        </Row>
      )}
    />
  );
};

export default ModelBar;
