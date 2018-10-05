import * as yup from 'yup';
import { userStatus } from '../helpers/userStatus';

const userValidation = yup.object().shape({
  name: yup.string().required('Name is a required field'),
  email: yup
    .string()
    .email('Please provide a valid email address')
    .required('Email is a required field'),
  status: yup.string().oneOf(Object.values(userStatus)),
});

export default userValidation;
