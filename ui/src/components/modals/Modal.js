import React from 'react';
import ReactModal from 'react-modal';
import { ClassNames } from '@emotion/react';

import { ModalStateContext } from 'providers/ModalState';

import styles from 'theme/modalStyles';

const Modal = () => (
  <ModalStateContext.Consumer>
    {(modalState) => (
      // Using `css` via ClassNames to avoid compilation error from emotion
      <ClassNames>
        {({ css }) => (
          <ReactModal
            isOpen={!!modalState.state.component}
            appElement={document.getElementById('root')}
            css={modalState.state.styles || styles}
            onRequestClose={() => modalState.setModalState({ component: null })}
            contentRef={(node) => modalState.setModalState({ contentRef: node })}
            overlayClassName={css`
              position: fixed;
              top: 0px;
              left: 0px;
              right: 0px;
              bottom: 0px;
              background-color: rgba(0, 0, 0, 0.75);
              display: block;
              z-index: 1000;
            `}
          >
            {modalState.state.component}
          </ReactModal>
        )}
      </ClassNames>
    )}
  </ModalStateContext.Consumer>
);

export default Modal;
