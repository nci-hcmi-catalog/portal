import React from 'react';
import { stringify } from 'query-string';

import { SavedSetsContext } from 'providers/SavedSets';

export default ({ sqon, history, children, ...props}) => (
  <SavedSetsContext.Consumer>
    {savedSetsContext => (
      <div
        className="clickable"
        {...props}
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
