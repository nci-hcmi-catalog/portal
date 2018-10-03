import React from 'react';
import { ModalStateContext } from 'providers/ModalState';
import { ModalWrapper, Header, Title, CloseModal, Content, Footer } from 'theme/adminModalStyles';
import { FormContainer, FormCol } from 'theme/adminFormStyles';
import { Pill } from 'theme/adminControlsStyles';
import { withFormik, Field } from 'formik';
import { schemaObj } from '../schema/user';
import { FormComponent, FormInput, FormRadioSelect } from 'components/FormComponents';
import { userStatus } from '@hcmi-portal/cms/src/helpers/userStatus';
import validationSchema from '@hcmi-portal/cms/src/validation/user';
import base from 'theme';
import { NotificationsContext } from '../Notifications';
const {
  keyedPalette: { lightPorcelain },
} = base;

const SubmitFormPill = Pill.withComponent('button');

const updateUser = userInfo => console.log(`Save user`);
const createUser = userInfo => console.log(`Create user`);

// All labels/keys from model schema
const { name, email, status } = schemaObj;

const UserFormTemplate = ({ values, errors, appendNotification }) => {
  return (
    <FormContainer
      css={`
        background: ${lightPorcelain};
      `}
    >
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
        <Pill secondary>Cancel</Pill>
        <SubmitFormPill type={'submit'} primary>
          Save
        </SubmitFormPill>
      </Footer>
    </FormContainer>
  );
};

const UserFormComponent = withFormik({
  mapPropsToValues: ({ user }) => user || {},
  validationSchema: validationSchema,
  handleSubmit: (values, { setSubmitting, appendNotification, closeModal }) => {
    const successNotification = {
      type: 'success',
      message: 'Save Successful!',
      details: 'User has been successfully saved.',
    };
    console.log(values);
    appendNotification(successNotification);
    closeModal();
  },
  displayName: 'UserForm',
})(UserFormTemplate);

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
    <NotificationsContext.Consumer>
      {appendNotification => (
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
                  padding: 0px 21px 21px;
                `}
              >
                <UserFormComponent
                  user={user}
                  appendNotification={appendNotification}
                  closeModal={() => modalState.setModalState({ component: null })}
                />
              </Content>
            </ModalWrapper>
          )}
        </ModalStateContext.Consumer>
      )}
    </NotificationsContext.Consumer>
  );
};
export default UserModal;
