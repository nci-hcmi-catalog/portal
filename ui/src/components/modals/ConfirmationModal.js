import React from 'react';

import { ModalStateContext } from 'providers/ModalState';

import {
  AdminModalStyleNarrow,
  ModalWrapper,
  Header,
  Title,
  CloseModal,
  Content,
  Footer,
} from 'theme/adminModalStyles';
import { HoverPill } from 'theme/adminControlsStyles';

const doThenClose = (next, modalState) => () => {
  next();
  return modalState.setModalState({ component: null });
};

const ConfirmationModal = ({
  title,
  message,
  confirmLabel = 'Ok',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel = () => false,
}) => (
  <ModalStateContext.Consumer>
    {modalState => (
      <ModalWrapper>
        <Header>
          <Title>{title}</Title>
          <CloseModal onClick={() => modalState.setModalState({ component: null })} />
        </Header>
        <Content
          css={`
            line-height: 2;
          `}
        >
          <span>{message}</span>
        </Content>
        <Footer>
          <HoverPill secondary onClick={doThenClose(onCancel, modalState)}>
            {cancelLabel}
          </HoverPill>
          <HoverPill primary onClick={doThenClose(onConfirm, modalState)}>
            {confirmLabel}
          </HoverPill>
        </Footer>
      </ModalWrapper>
    )}
  </ModalStateContext.Consumer>
);

export default ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => Component => (
  <ModalStateContext.Consumer>
    {modalState =>
      React.cloneElement(Component, {
        onClick: () =>
          modalState.setModalState({
            component: (
              <ConfirmationModal
                {...{ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }}
              />
            ),
            shouldCloseOnOverlayClick: true,
            styles: AdminModalStyleNarrow,
          }),
      })
    }
  </ModalStateContext.Consumer>
);
