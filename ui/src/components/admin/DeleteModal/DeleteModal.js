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
import { Pill } from 'theme/adminControlsStyles';

const doThenClose = (next, modalState) => () => {
  next();
  return modalState.setModalState({ component: null });
};

const DeleteModal = ({ next, target, onCancel = () => false }) => (
  <ModalStateContext.Consumer>
    {modalState => (
      <ModalWrapper>
        <Header>
          <Title>Delete</Title>
          <CloseModal onClick={() => modalState.setModalState({ component: null })} />
        </Header>
        <Content
          css={`
            line-height: 2;
          `}
        >
          <span
            css={`
              font-size: 16px;
              margin-bottom: 2em;
            `}
          >
            Are you sure you want to delete <strong>{target}</strong>? This action cannot be undone.
          </span>
          <span
            css={`
              font-size: 14px;
              font-style: italic;
              color: #64666a;
            `}
          >
            Note: This image will be available on the searchable catalog until the model is
            republished.
          </span>
        </Content>
        <Footer>
          <Pill secondary onClick={doThenClose(onCancel, modalState)}>
            Cancel
          </Pill>
          <Pill primary onClick={doThenClose(next, modalState)}>
            Delete
          </Pill>
        </Footer>
      </ModalWrapper>
    )}
  </ModalStateContext.Consumer>
);

export default ({ next, target, onCancel }) => Component => (
  <ModalStateContext.Consumer>
    {modalState =>
      React.cloneElement(Component, {
        onClick: () =>
          modalState.setModalState({
            component: <DeleteModal {...{ next, target, onCancel }} />,
            shouldCloseOnOverlayClick: true,
            styles: AdminModalStyleNarrow,
          }),
      })
    }
  </ModalStateContext.Consumer>
);
