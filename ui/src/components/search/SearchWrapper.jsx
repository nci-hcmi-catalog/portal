import Component from 'react-component-component';

import { SavedSetsContext } from '../../providers/SavedSets';
import WithUrlProps from '../WithUrlProps';
import Search from './Search';

const SearchWrapper = (props) => (
  <Component initialState={{ sorted: [], panelSize: 300 }}>
    {(state) => (
      <WithUrlProps
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
