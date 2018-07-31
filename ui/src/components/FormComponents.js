import React from 'react';
import {
  FormBlock,
  FormBlockLabel,
  FormFieldDesc,
  CheckBoxes,
  RadioSelect,
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
    <input type="text" {...field} {...props} />
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </>
);

export const FormSelect = ({ field, form: { touched, errors }, ...props }) => (
  <>
    <select type="select" {...field} {...props}>
      <option value="0">-- Select an Option --</option>
      {props.options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </>
);

export const FormRadioSelect = ({ field, form: { touched, errors }, ...props }) => (
  <>
    <RadioSelect {...props}>
      {props.options.map((option, idx) => (
        <label key={idx}>
          {option}
          <input type="radio" {...field} value={option} />
          <span />
        </label>
      ))}
    </RadioSelect>
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </>
);

export const FormMultiCheckbox = ({ field, form: { touched, errors }, ...props }) => (
  <>
    <CheckBoxes {...props}>
      {props.options.map((option, idx) => (
        <label key={idx}>
          {option}
          <input type="checkbox" {...field} value={option} />
          <span />
        </label>
      ))}
    </CheckBoxes>
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </>
);
