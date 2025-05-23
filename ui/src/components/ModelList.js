import React from 'react';
import ModelListModal from 'components/modals/ModelListModal';
import { SelectedModelsContext } from 'providers/SelectedModels';
import { ModalStateContext } from 'providers/ModalState';
import styles from 'theme/modelListStyles';
import modelListModalStyles from 'theme/modelListModalStyles';
import { ButtonPill } from 'theme/adminControlsStyles';
import ListIcon from 'icons/ListIcon';

const ModelList = ({ className }) => (
  <ModalStateContext.Consumer>
    {(modalState) => (
      <SelectedModelsContext.Consumer>
        {(selected) => {
          const selectedCount = selected?.state ? selected.state.modelIds.length : 0;
          const hasSelected = selectedCount > 0;
          return (
            <div className={'model-list-button__wrapper'} css={styles}>
              <ButtonPill
                aria-label={`Show models selected for download`}
                className={`model-list-button ${className}`}
                onClick={() =>
                  modalState.setModalState({
                    component: <ModelListModal />,
                    styles: modelListModalStyles,
                    shouldCloseOnOverlayClick: true,
                  })
                }
              >
                <ListIcon fill="#fff" with="16px" height="16px" />
                VIEW LIST
                {hasSelected && <span className="count">{selectedCount}</span>}
              </ButtonPill>
            </div>
          );
        }}
      </SelectedModelsContext.Consumer>
    )}
  </ModalStateContext.Consumer>
);

export default ModelList;
