import React from 'react';
import { Field } from 'formik';
import { startCase } from 'lodash';
import { FormBlock, FormFieldDesc } from 'theme/adminModelFormStyles';

export const FormComponent = ({
  children,
  children: {
    props: { name },
  },
  labelText,
  description,
}) => (
  <FormBlock>
    <label for={name}>{labelText || name}:</label>
    {description && <FormFieldDesc>{description}</FormFieldDesc>}
    {children}
  </FormBlock>
);

export const FormSelect = ({ field, form: { touched, errors }, ...props }) => (
  <div>
    <select type="select" {...field}>
      {props.options.map(option => <option value={option}>{startCase(option)}</option>)}
    </select>
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);
