import React from 'react';
import Modal from 'react-modal';
import { css } from 'emotion';

import { ModalStateContext } from 'providers/ModalState';

import styles from 'theme/modalStyles';

export default () => (
  <ModalStateContext.Consumer>
    {modalState => (
      <Modal
        isOpen={!!modalState.state.component}
        appElement={document.getElementById('root')}
        css={modalState.state.styles || styles}
        onRequestClose={() => modalState.setModalState({ component: null })}
        contentRef={node => modalState.setModalState({ contentRef: node })}
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
      </Modal>
    )}
  </ModalStateContext.Consumer>
);
