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
import { ButtonPill } from 'theme/adminControlsStyles';

const doThenClose = (next, modalState) => () => {
  next();
  return modalState.setModalState({ component: null });
};

const ConfirmationModalContents = ({
  title,
  message,
  confirmLabel = 'Ok',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel = () => false,
}) => (
  <ModalStateContext.Consumer>
    {(modalState) => (
      <ModalWrapper>
        <Header>
          <Title>{title}</Title>
          <CloseModal onClick={() => modalState.setModalState({ component: null })} />
        </Header>
        <Content>
          <span>{message}</span>
        </Content>
        <Footer>
          <ButtonPill primary marginRight={'10px'} onClick={doThenClose(onConfirm, modalState)}>
            {confirmLabel}
          </ButtonPill>
          <ButtonPill secondary onClick={doThenClose(onCancel, modalState)}>
            {cancelLabel}
          </ButtonPill>
        </Footer>
      </ModalWrapper>
    )}
  </ModalStateContext.Consumer>
);

const ConfirmationModal =
  ({
    title,
    message,
    confirmationRequired = true,
    confirmLabel,
    cancelLabel,
    onConfirm,
    onCancel,
  }) =>
  (Component) =>
    (
      <ModalStateContext.Consumer>
        {(modalState) =>
          React.cloneElement(Component, {
            onClick: () => {
              if (confirmationRequired) {
                modalState.setModalState({
                  component: (
                    <ConfirmationModalContents
                      {...{ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }}
                    />
                  ),
                  shouldCloseOnOverlayClick: true,
                  styles: AdminModalStyleNarrow,
                });
              } else {
                onConfirm();
              }
            },
          })
        }
      </ModalStateContext.Consumer>
    );

export default ConfirmationModal;
