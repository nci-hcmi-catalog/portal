import React from 'react';
import { ModalStateContext } from 'providers/ModalState';
import { ModalWrapper, Header, Title, CloseModal, Content, Footer } from 'theme/adminModalStyles';
import { Pill } from 'theme/adminControlsStyles';

const updateUser = userInfo => console.log(`Save user`);
const createUser = userInfo => console.log(`Create user`);

const doThenClose = (next, modalState) => () => {
  next();
  return modalState.setModalState({ component: null });
};
const UserModal = ({
  type,
  user = { name: '', email: '', status: '', id: '' },
  onCancel = () => false,
}) => {
  const actionTitle = 'add' === type ? `Add new` : `Edit`;
  return (
    <ModalStateContext.Consumer>
      {modalState => (
        <ModalWrapper>
          <Header>
            <Title>{`${actionTitle} User`}</Title>
            <CloseModal onClick={() => modalState.setModalState({ component: null })} />
          </Header>
          <Content
            css={`
              line-height: 2;
            `}
          />
          <Footer>
            <Pill secondary onClick={doThenClose(onCancel, modalState)}>
              Cancel
            </Pill>
            <Pill primary onClick={doThenClose(() => updateUser(user), modalState)}>
              Save
            </Pill>
          </Footer>
        </ModalWrapper>
      )}
    </ModalStateContext.Consumer>
  );
};
export default UserModal;
