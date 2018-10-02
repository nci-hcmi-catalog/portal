import React from 'react';
import { ModalStateContext } from 'providers/ModalState';
import { ModalWrapper, Header, Title, CloseModal, Content, Footer } from 'theme/adminModalStyles';
import { FormContainer, FormCol } from 'theme/adminFormStyles';
import { Pill } from 'theme/adminControlsStyles';
import { withFormik, Field } from 'formik';
import { schemaObj } from '../schema/user';
import { FormComponent, FormInput, FormRadioSelect } from 'components/FormComponents';
import { userStatus } from '@hcmi-portal/cms/src/helpers/userStatus';
import * as Yup from 'yup';
import base from 'theme';

const {
  keyedPalette: { lightPorcelain },
} = base;
const updateUser = userInfo => console.log(`Save user`);
const createUser = userInfo => console.log(`Create user`);

// All labels/keys from model schema
const { name, email, status } = schemaObj;

const UserFormTemplate = ({ values, errors }) => {
  return (
    <FormContainer
      css={`
        background: ${lightPorcelain};
        padding: 0;
        margin: 0;
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
        <Pill primary>Save</Pill>
      </Footer>
    </FormContainer>
  );
};

const UserFormComponent = withFormik({
  mapPropsToValues: ({ user }) => user || {},
  validationSchema: Yup.object().shape({
    name: Yup.string().required('Name is a required field'),
    email: Yup.string()
      .email('Please provide a valid email address')
      .required('Email is a required field'),
    status: Yup.string()
      .oneOf(Object.values(userStatus))
      .default(),
  }),
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
            <UserFormComponent user={user} />
          </Content>
        </ModalWrapper>
      )}
    </ModalStateContext.Consumer>
  );
};
export default UserModal;
