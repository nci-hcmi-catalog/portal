import React from 'react';
import Component from 'react-component-component';
import '../admin/AdminTable/beagle.css';

import { SavedSetsContext } from '../../providers/SavedSets';
import Url from '../Url';
// import Search from './Search';

const SearchWrapper = (props) => (
  <Component initialState={{ sorted: [], panelSize: 300 }}>
    {(state) => (
      <Url
        render={(urlProps) => (
          <SavedSetsContext.Consumer>
            {/* {(savedSetsContext) => (
          {...urlProps}
          <Search {...props} {...state} savedSetsContext={savedSetsContext} />
        )} */}
          </SavedSetsContext.Consumer>
        )}
      />
    )}
  </Component>
);

export default SearchWrapper;
