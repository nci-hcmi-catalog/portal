import React from 'react';
import { stringify } from 'query-string';

import { SavedSetsContext } from 'providers/SavedSets';

export default ({ sqon, history, children }) => (
  <SavedSetsContext.Consumer>
    {savedSetsContext => (
      <div
        className="clickable"
        onClick={() => {
          if (sqon) {
            const setId = sqon.content.value;
            const savedSqon = savedSetsContext.state.sets[setId].sqon;
            history.push({
              pathname: '/',
              search: stringify({
                sqon: JSON.stringify(savedSqon),
              }),
            });
          } else {
            history.push('/');
          }
        }}
      >
        {children}
      </div>
    )}
  </SavedSetsContext.Consumer>
);
