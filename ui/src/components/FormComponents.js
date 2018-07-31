import React from 'react';
import {
  FormBlock,
  FormBlockLabel,
  FormFieldDesc,
  CheckBoxes,
  RadioSelect,
  FormFieldError,
} from 'theme/formComponentsStyles';

export const FormComponent = ({
  children,
  children: {
    props: { name },
  },
  labelText,
  description,
}) => (
  <FormBlock>
    <FormBlockLabel htmlFor={name}>{labelText || name}:</FormBlockLabel>
    {description && <FormFieldDesc>{description}</FormFieldDesc>}
    {children}
  </FormBlock>
);

export const FormTextInput = ({ field, form: { touched, errors }, ...props }) => (
  <>
    {touched[field.name] && errors[field.name] && <FormFieldError>{errors[field.name]}</FormFieldError>}
    <input type="text" {...field} {...props} />
  </>
);

export const FormSelect = ({ field, form: { touched, errors }, ...props }) => (
  <>
    {touched[field.name] && errors[field.name] && <FormFieldError>{errors[field.name]}</FormFieldError>}
    <select type="select" {...field} {...props}>
      <option value="0">-- Select an Option --</option>
      {props.options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
  </>
);

export const FormRadioSelect = ({ field, form: { touched, errors }, ...props }) => (
  <>
    {touched[field.name] && errors[field.name] && <FormFieldError>{errors[field.name]}</FormFieldError>}
    <RadioSelect {...props}>
      {props.options.map((option, idx) => (
        <label key={idx}>
          {option}
          <input type="radio" {...field} value={option} />
          <span />
        </label>
      ))}
    </RadioSelect>
  </>
);

export const FormMultiCheckbox = ({ field, form: { touched, errors }, ...props }) => (
  <>
    {touched[field.name] && errors[field.name] && <FormFieldError>{errors[field.name]}</FormFieldError>}
    <CheckBoxes {...props}>
      {props.options.map((option, idx) => (
        <label key={idx}>
          {option}
          <input type="checkbox" {...field} value={option} />
          <span />
        </label>
      ))}
    </CheckBoxes>
  </>
);
