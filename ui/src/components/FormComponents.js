import React from 'react';
import { FormBlock, FormFieldDesc } from 'theme/adminModelFormStyles';
import { CheckBoxes } from 'theme/formComponentsStyles';

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
  <>
    <select type="select" {...field}>
      {props.options.map(option => <option value={option}>{option}</option>)}
    </select>
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </>
);

export const FormMultiCheckbox = ({ field, form: { touched, errors }, ...props }) => (
  <>
    <CheckBoxes>
      {props.options.map(option => (
        <label>
          <input type="checkbox" {...field} value={option} />
          {option}
        </label>
      ))}
    </CheckBoxes>
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </>
);
