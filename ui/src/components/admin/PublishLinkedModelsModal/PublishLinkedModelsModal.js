import React from 'react';
import { css } from '@emotion/react';

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

const PublishLinkedModelsModal = ({ next, modelNames, onCancel = () => false }) => (
  <ModalStateContext.Consumer>
    {modalState => (
      <ModalWrapper>
        <Header>
          <Title>Publish all linked models?</Title>
          <CloseModal onClick={() => modalState.setModalState({ component: null })} />
        </Header>
        <Content
          css={css`
            line-height: 2;
          `}
        >
          <span>
            Publishing this model will also publish changes to the following models:
            <ul>
              {modelNames.map(model => (
                <li key={model}>
                  <strong>{model}</strong>
                </li>
              ))}
            </ul>
          </span>
        </Content>
        <Footer>
          <ButtonPill primary marginRight={'10px'} onClick={doThenClose(next, modalState)}>
            Yes, Publish All
          </ButtonPill>
          <ButtonPill secondary onClick={doThenClose(onCancel, modalState)}>
            Cancel
          </ButtonPill>
        </Footer>
      </ModalWrapper>
    )}
  </ModalStateContext.Consumer>
);

export default ({ disabled = true, next, modelNames = [], onCancel }) => Component => (
  <ModalStateContext.Consumer>
    {modalState =>
      React.cloneElement(Component, {
        onClick: () => {
          if (!disabled) {
            if (modelNames.length > 0) {
              modalState.setModalState({
                component: (
                  <PublishLinkedModelsModal
                    {...{ next, modelNames }}
                    onCancel={
                      onCancel ? onCancel : () => modalState.setModalState({ component: null })
                    }
                  />
                ),
                shouldCloseOnOverlayClick: true,
                styles: AdminModalStyleNarrow,
              });
            } else {
              next();
            }
          }
        },
      })
    }
  </ModalStateContext.Consumer>
);
