import * as yup from 'yup';
import { userStatus } from '../helpers/userStatus';
import { runYupValidatorFailFast } from '../helpers/validation';

const userValidation = yup.object().shape({
  name: yup.string().required('Name is a required field'),
  email: yup
    .string()
    .email('Please provide a valid email address')
    .required('Email is a required field'),
  status: yup
    .string()
    .oneOf(Object.values(userStatus))
    .default(),
});

export const validateUserRequest = (req, res, next) => {
  runYupValidatorFailFast(userValidation, [req.body])
    .then(() => next())
    .catch(error => {
      res.status(400).json({
        error,
      });
    });
};

export default userValidation;
