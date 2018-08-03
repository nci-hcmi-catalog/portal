import React from 'react';
import { FieldArray } from 'formik';
import {
  FormBlock,
  FormBlockLabel,
  FormFieldDesc,
  Input,
  Select,
  CheckBoxes,
  RadioSelect,
  FormFieldError,
  inputSelectErrorIcon,
  checkboxRadioErrorIcon,
} from 'theme/formComponentsStyles';
import FormFieldErrorIcon from 'icons/FormFieldErrorIcon';

const hasErrors = (errors, touched, fieldName) => touched[fieldName] && errors[fieldName];

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
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>{errors[field.name]}</FormFieldError>
    )}
    <Input type="text" {...field} {...props} errors={hasErrors(errors, touched, field.name)} />
    {hasErrors(errors, touched, field.name) && <FormFieldErrorIcon css={inputSelectErrorIcon} />}
  </>
);

export const FormSelect = ({ field, form: { touched, errors }, ...props }) => (
  <>
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>{errors[field.name]}</FormFieldError>
    )}
    <Select {...field} {...props} errors={hasErrors(errors, touched, field.name)}>
      <option value="0">-- Select an Option --</option>
      {props.options.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </Select>
    {hasErrors(errors, touched, field.name) && <FormFieldErrorIcon css={inputSelectErrorIcon} />}
  </>
);

export const FormRadioSelect = ({ field, form: { touched, errors }, ...props }) => (
  <>
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>
        {errors[field.name]}
        <FormFieldErrorIcon css={checkboxRadioErrorIcon} />
      </FormFieldError>
    )}
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

export const FormMultiCheckbox = ({
  field,
  form: { touched, errors, setFieldValue, setFieldTouched },
  ...props
}) => {
  const fieldName = field.name;
  const values = props.values[fieldName] || [];
  return (
    <>
      {hasErrors(errors, touched, fieldName) && (
        <FormFieldError>
          {errors[fieldName]}
          <FormFieldErrorIcon css={checkboxRadioErrorIcon} />
        </FormFieldError>
      )}
      <CheckBoxes {...props}>
        {props.options.map((option, idx) => (
          <label key={idx}>
            {option}
            <input
              type="checkbox"
              value={option}
              checked={values.includes(option)}
              name={fieldName}
              onChange={e => {
                const newSelects = e.target.checked
                  ? values.concat([option])
                  : values.filter(value => value !== option);
                setFieldValue(fieldName, newSelects);
                setFieldTouched(fieldName);
              }}
            />
            <span />
          </label>
        ))}
      </CheckBoxes>
    </>
  );
};
