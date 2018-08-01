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

export const FormMultiCheckbox = ({ field, form: { touched, errors }, ...props }) => (
  <FieldArray
    name={field.name}
    render={arrayHelpers => (
      <>
        {hasErrors(errors, touched, field.name) && (
          <FormFieldError>
            {errors[field.name]}
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
                checked={(props.values[field.name] || []).includes(option)}
                name={field.name}
                onChange={e => {
                  if (e.target.checked) {
                    arrayHelpers.push(option);
                  } else {
                    props.values[field.name] = props.values[field.name].filter(
                      selectedOption => selectedOption !== option,
                    );
                  }
                }}
              />
              <span />
            </label>
          ))}
        </CheckBoxes>
      </>
    )}
  />
);
