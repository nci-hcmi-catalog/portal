import React from 'react';
import { ModalStateContext } from 'providers/ModalState';
import { ModalWrapper, Header, Title, CloseModal, Content, Footer } from 'theme/adminModalStyles';
import { FormContainer, FormCol } from 'theme/adminFormStyles';
import { ButtonPill, HoverPill } from 'theme/adminControlsStyles';
import { withFormik, Field } from 'formik';
import { schemaObj } from '@hcmi-portal/cms/src/schemas/descriptions/user';
import { FormComponent, FormInput, FormRadioSelect } from 'components/FormComponents';
import { userStatus } from '@hcmi-portal/cms/src/helpers/userStatus';
import validationSchema from '@hcmi-portal/cms/src/validation/user';

// All labels/keys from model schema
const { name, email, status } = schemaObj;

const UserFormTemplate = ({ closeModal }) => {
  return (
    <FormContainer>
      <FormCol>
        <FormComponent labelText={name.displayName}>
          <Field name={name.accessor} component={FormInput} />
        </FormComponent>

        <FormComponent labelText={email.displayName}>
          <Field name={email.accessor} component={FormInput} />
        </FormComponent>

        <FormComponent labelText={status.displayName}>
          <Field
            name={status.accessor}
            component={FormRadioSelect}
            options={Object.values(userStatus)}
          />
        </FormComponent>
      </FormCol>
      <Footer>
        <ButtonPill type={'submit'} primary marginRight={'10px'}>
          Save
        </ButtonPill>
        <HoverPill secondary onClick={closeModal}>
          Cancel
        </HoverPill>
      </Footer>
    </FormContainer>
  );
};

const UserFormComponent = withFormik({
  mapPropsToValues: ({ user }) => user || {},
  validationSchema: validationSchema,
  handleSubmit: async (values, { props: { closeModal, saveUser, type } }) => {
    await saveUser({ values, isUpdate: type === 'edit' });
    closeModal();
  },
  displayName: 'UserForm',
})(UserFormTemplate);

const UserModal = ({
  type,
  user = { name: '', email: '', status: userStatus.active, id: '' },
  saveUser,
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
          <Content>
            <UserFormComponent
              user={user}
              type={type}
              closeModal={() => modalState.setModalState({ component: null })}
              saveUser={saveUser}
            />
          </Content>
        </ModalWrapper>
      )}
    </ModalStateContext.Consumer>
  );
};
export default UserModal;
