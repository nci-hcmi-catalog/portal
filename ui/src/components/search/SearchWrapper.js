import React from 'react';
import Component from 'react-component-component';
import { Arranger } from '@arranger/components/dist/Arranger';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import Url from 'components/Url';
import { SavedSetsContext } from 'providers/SavedSets';
import Search from 'components/search/Search';

export default props => (
  <Component initialState={{ sorted: [], panelSize: 300 }}>
    {state => (
      <Url
        render={urlProps => (
          <SavedSetsContext.Consumer>
            {savedSetsContext => (
              <Arranger
                {...props}
                projectId={props.version}
                render={props => (
                  <Search
                    {...props}
                    {...urlProps}
                    {...state}
                    savedSetsContext={savedSetsContext}
                    version={props.projectId}
                  />
                )}
              />
            )}
          </SavedSetsContext.Consumer>
        )}
      />
    )}
  </Component>
);
