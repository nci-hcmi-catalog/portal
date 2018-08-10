import React from 'react';
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

// Map simple string/number options to keyed objects
const processOptions = options =>
  options.map(
    option =>
      typeof option === 'object' && option.constructor === Object
        ? option
        : { label: option, value: option },
  );

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

export const FormSelect = ({ field, form: { touched, errors }, disabled, ...props }) => (
  <>
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>{errors[field.name]}</FormFieldError>
    )}
    {/* Select fields will be disabled if they have no options, as is possible when selecting
        tumor diagnosis based options  */}
    <Select
      disabled={disabled || props.options.length === 0}
      {...field}
      {...props}
      errors={hasErrors(errors, touched, field.name)}
    >
      <option value="0">-- Select an Option --</option>
      {processOptions(props.options).map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
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
        {/* Radio Select will only ever error when they are required so we
            will simplify the messaging for the front-end */}
        {[field.name]} is a required field
        <FormFieldErrorIcon css={checkboxRadioErrorIcon} />
      </FormFieldError>
    )}
    <RadioSelect {...props}>
      {processOptions(props.options).map((option, idx) => (
        <label key={idx}>
          {option.label}
          <input type="radio" {...field} value={option.value} />
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
  const options = props.values[fieldName] || [];
  return (
    <>
      {hasErrors(errors, touched, fieldName) && (
        <FormFieldError>
          {errors[fieldName]}
          <FormFieldErrorIcon css={checkboxRadioErrorIcon} />
        </FormFieldError>
      )}
      <CheckBoxes {...props}>
        {processOptions(props.options).map((option, idx) => {
          const name = option.label;
          const value = option.value;
          return (
            <label key={idx}>
              {name}
              <input
                type="checkbox"
                value={value}
                checked={options.includes(value)}
                name={fieldName}
                onChange={e => {
                  const newSelects = e.target.checked
                    ? options.concat([value])
                    : options.filter(option => option !== value);
                  setFieldValue(fieldName, newSelects);
                  setFieldTouched(fieldName);
                }}
              />
              <span />
            </label>
          );
        })}
      </CheckBoxes>
    </>
  );
};

export const FromLabelHeader = ({ labelText, description }) => (
  <FormBlock>
    <FormBlockLabel>{labelText}:</FormBlockLabel>
    {description && <FormFieldDesc>{description}</FormFieldDesc>}
  </FormBlock>
);
