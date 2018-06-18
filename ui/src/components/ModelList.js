import React from 'react';
import ModelListModal from 'components/modals/ModelListModal';
import { SelectedModelsContext } from 'providers/SelectedModels';
import { ModalStateContext } from 'providers/ModalState';
import styles from 'theme/modelListStyles';
import modelListModalStyles from 'theme/modelListModalStyles';

const ModalListIcon = ({ className, selected }) => (
  <ModalStateContext.Consumer>
    {modalState => {
      const selectedCount = selected.state.models.length;
      const hasSelected = selectedCount > 0;
      return (
        <div css={styles}>
          <div
            className={`model-list-icon ${hasSelected ? 'not-empty' : ''} ${className}`}
            onClick={() =>
              modalState.setModal({
                component: <ModelListModal modalState={modalState} selected={selected} />,
                styles: modelListModalStyles,
              })
            }
          >
            {hasSelected ? <span className="count">{selectedCount}</span> : null}
          </div>
        </div>
      );
    }}
  </ModalStateContext.Consumer>
);

export default ({ className }) => (
  <SelectedModelsContext.Consumer>
    {selected => {
      return <ModalListIcon className={className} selected={selected} />;
    }}
  </SelectedModelsContext.Consumer>
);
