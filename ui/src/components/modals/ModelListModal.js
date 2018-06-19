import React from 'react';
import moment from 'moment';
import { SelectedModelsContext } from 'providers/SelectedModels';
import ModelPlaceholderIcon from 'icons/ModelPlaceholderIcon';
import TrashIcon from 'icons/TrashIcon';
import DownloadIconWhite from 'icons/DownloadIconWhite';
import modelListEmptyRedPlus from 'assets/icon-modellist-empty-red.svg';
import modelImageProcessor from 'utils/modelImageProcessor';

const EmptyList = () => (
  <div className="empty-list">
    <img src={modelListEmptyRedPlus} alt="Add to list icon" width="26" height="30" />
    <p>You don’t have any models selected.</p>
    <a href="/">Browse models »</a>
  </div>
);

export default ({ modalState }) => (
  <SelectedModelsContext.Consumer>
    {selected => {
      const selectedCount = selected.state.models.length;
      const hasSelected = selectedCount > 0;
      return (
        <>
          <div className="model-list-drawer-header">
            <h2>
              My Model List{hasSelected ? <span className="count">{selectedCount}</span> : null}
            </h2>
            <button
              disabled={!hasSelected}
              onClick={() => selected.clearModels()}
              className="clear"
            >
              Clear
            </button>
          </div>

          {hasSelected ? (
            <div className="model-list-scroll-container">
              <div className="model-list-models">
                {selected.state.models.map((model, idx) => {
                  const modelImages = modelImageProcessor(
                    model.files ? model.files.hits.edges : [],
                  );
                  return (
                    <div className="model-list-model" key={idx}>
                      {modelImages.length > 0 ? (
                        <img
                          src={modelImages[0].file_name}
                          alt="model representation"
                          width="100"
                          height="74"
                          className="model-image"
                        />
                      ) : (
                        <div className="model-placeholder-image">
                          <ModelPlaceholderIcon width={47} height={47} />
                        </div>
                      )}

                      <div className="model-list-model-content">
                        <h3>{model.name}</h3>
                        <p className="available-label">Available:</p>
                        <p className="available-date">
                          {moment(model.date_of_availability).format('MMMM DD, YYYY')}
                        </p>
                      </div>
                      <TrashIcon
                        width={13}
                        height={17}
                        onClick={() => selected.toggleModel(model)}
                        css={`
                          cursor: pointer;
                          margin: 0 0 0 10px;
                        `}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyList />
          )}
          <div className="download-tsv">
            <button
              className="download-tsv-btn"
              disabled={!hasSelected}
              onClick={() => {
                console.log('stuff');
              }}
            >
              <DownloadIconWhite
                width={12}
                height={14}
                css={`
                  margin-right: 14px;
                `}
              />Download TSV
            </button>
          </div>
        </>
      );
    }}
  </SelectedModelsContext.Consumer>
);
