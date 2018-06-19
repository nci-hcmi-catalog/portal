import React from 'react';
import { SelectedModelsContext } from 'providers/SelectedModels';

const EmptyList = () => (
  <div className="empty-list">
    <img src="addtolist.svg" alt="Add to list icon" />
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
            <div className="model-list-models">
              {selected.state.models.map((model, idx) => (
                <div className="model-list-model" key={idx}>
                  <img src="" alt="model representation" />
                  <div className="model-list-model-content">
                    <h3>{model.name}</h3>
                    <p className="available-label">Available:</p>
                    <p className="available-date">{model.name}</p>
                  </div>
                  <div className="actions">
                    <div className="delete-icon" onClick={() => selected.toggleModel(model)} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyList />
          )}
          <button
            onClick={() => {
              modalState.setModal({ component: null });
            }}
          >
            Close
          </button>
        </>
      );
    }}
  </SelectedModelsContext.Consumer>
);
