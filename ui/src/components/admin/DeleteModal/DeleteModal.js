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

const DeleteModalComponent = ({ next, target, onCancel = () => false }) => (
  <ModalStateContext.Consumer>
    {(modalState) => (
      <ModalWrapper>
        <Header>
          <Title>Delete</Title>
          <CloseModal onClick={() => modalState.setModalState({ component: null })} />
        </Header>
        <Content>
          <span>
            Are you sure you want to delete <strong>{target}</strong>? This action cannot be undone.
          </span>
        </Content>
        <Footer>
          <ButtonPill primary marginRight={'10px'} onClick={doThenClose(next, modalState)}>
            Delete
          </ButtonPill>
          <ButtonPill secondary onClick={doThenClose(onCancel, modalState)}>
            Cancel
          </ButtonPill>
        </Footer>
      </ModalWrapper>
    )}
  </ModalStateContext.Consumer>
);

const DeleteModal =
  ({ next, target, onCancel }) =>
  (Component) =>
    (
      <ModalStateContext.Consumer>
        {(modalState) =>
          React.cloneElement(Component, {
            onClick: () =>
              modalState.setModalState({
                component: <DeleteModalComponent {...{ next, target, onCancel }} />,
                shouldCloseOnOverlayClick: true,
                styles: AdminModalStyleNarrow,
              }),
          })
        }
      </ModalStateContext.Consumer>
    );

export default DeleteModal;
