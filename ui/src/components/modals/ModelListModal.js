import React from 'react';

export default ({ modalState, selected }) => {
  const selectedCount = selected.state.models.length;
  const hasSelected = selectedCount > 0;
  return (
    <>
      <div className="model-list-drawer-header">
        <h2>
          My Model List <span className="count">{selectedCount}</span>
        </h2>
        <button onClick={() => selected.clearModels()} className="clear">
          Clear
        </button>
      </div>

      {hasSelected ? (
        <ul>{selected.state.models.map((model, idx) => <li key={idx}>{model.name}</li>)}</ul>
      ) : null}
      <button
        onClick={() => {
          modalState.setModal({ component: null });
        }}
      >
        Close
      </button>
    </>
  );
};
