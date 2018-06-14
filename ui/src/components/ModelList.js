import React from 'react';
import Component from 'react-component-component';
import { SelectedModelsContext } from 'providers/SelectedModels';
import styles from 'theme/modelListStyles';

export default ({ className }) => (
  <SelectedModelsContext.Consumer>
    {selected => {
      const selectedCount = selected.state.models.length;
      const hasSelected = selectedCount > 0;
      return (
        <Component>
          <div css={styles}>
            <div className={`model-list-icon ${hasSelected ? 'not-empty' : ''} ${className}`}>
              {hasSelected ? <span className="count">{selectedCount}</span> : null}
            </div>
          </div>
        </Component>
      );
    }}
  </SelectedModelsContext.Consumer>
);
