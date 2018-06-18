import React from 'react';

export default ({ modalState }) => (
  <div>
    <p>Test Modal</p>
    <button
      onClick={() => {
        modalState.setModal({ component: null });
      }}
    >
      Close
    </button>
  </div>
);
