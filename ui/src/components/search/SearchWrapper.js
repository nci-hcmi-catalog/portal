import React from 'react';
import Component from 'react-component-component';
import './beagle.css';

import Url from 'components/Url';
import { SavedSetsContext } from 'providers/SavedSets';
import Search from 'components/search/Search';

const SearchWrapper = (props) => (
  <Component initialState={{ sorted: [], panelSize: 300 }}>
    {(state) => (
      <Url
        render={(urlProps) => (
          <SavedSetsContext.Consumer>
            {(savedSetsContext) => (
              <Search {...props} {...urlProps} {...state} savedSetsContext={savedSetsContext} />
            )}
          </SavedSetsContext.Consumer>
        )}
      />
    )}
  </Component>
);

export default SearchWrapper;
