import React from 'react';
import Component from 'react-component-component';
import ReactAutocomplete from 'react-autocomplete';
import moment from 'moment';
import { isEqual } from 'lodash';
import {
  FormBlock,
  FormBlockLabel,
  FormFieldDesc,
  Input,
  Select,
  AutoCompleteWrapper,
  AutoCompleteMenu,
  AutoCompleteOption,
  DatePicker,
  CheckBoxes,
  RadioSelect,
  FormFieldError,
  inputSelectErrorIcon,
  checkboxRadioErrorIcon,
} from 'theme/formComponentsStyles';
import FormFieldErrorIcon from 'icons/FormFieldErrorIcon';

const hasErrors = (errors, touched, fieldName) => touched[fieldName] && errors[fieldName];

const normalizeOption = option => (option === 'true' ? true : option === 'false' ? false : option);

// Map simple string/number options to keyed objects
const processOptions = options =>
  options.map(
    option =>
      typeof option === 'object' && option.constructor === Object
        ? option
        : { label: option, value: normalizeOption(option) },
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

export const FormInput = ({ field, form: { touched, errors }, type = 'text', ...props }) => (
  <>
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>{errors[field.name]}</FormFieldError>
    )}
    <Input type={type} {...field} {...props} errors={hasErrors(errors, touched, field.name)} />
    {hasErrors(errors, touched, field.name) && <FormFieldErrorIcon css={inputSelectErrorIcon} />}
  </>
);

// ES date format === yyyy-MM-dd HH:mm:ss.SSSSSS||yyyy-MM-dd HH:mm:ss
export const FormDateInput = ({ field, form: { touched, errors }, ...props }) => (
  <>
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>{errors[field.name]}</FormFieldError>
    )}
    <DatePicker
      {...field}
      type="date"
      value={field.value && field.value.length > 0 ? moment(field.value).format('YYYY-MM-DD') : ''}
      {...props}
      errors={hasErrors(errors, touched, field.name)}
    />
    {hasErrors(errors, touched, field.name) && <FormFieldErrorIcon css={inputSelectErrorIcon} />}
  </>
);

export const FormSelect = ({
  field,
  form: { values, setFieldTouched, touched, errors },
  options = [],
  disabled,
  ...props
}) => (
  <Component
    processedOptions={processOptions(options)}
    didUpdate={({ props, prevProps }) => {
      /* If a select has dynamic options, reset the selection
         field if the options change (no value and touched === false) */
      if (!isEqual(props.processedOptions, prevProps.processedOptions)) {
        /* Formik does not have a "remove" or "unset" and their reset function
           is too heavy handed for what we are trying to do here so ... direct
           mutation of the values ... forgive me */
        values[field.name] = '';
        setFieldTouched(field.name, false);
      }
    }}
  >
    {({ props: { processedOptions } }) => (
      <>
        {hasErrors(errors, touched, field.name) && (
          <FormFieldError>{errors[field.name]}</FormFieldError>
        )}
        {/* Select fields will be disabled if they have no options, as is possible when selecting
        tumor diagnosis based options */}
        <Select
          disabled={disabled || Object.keys(processedOptions).length === 0}
          {...field}
          {...props}
          errors={hasErrors(errors, touched, field.name)}
        >
          <option value="">-- Select an Option --</option>
          {processedOptions.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {hasErrors(errors, touched, field.name) && (
          <FormFieldErrorIcon css={inputSelectErrorIcon} />
        )}
      </>
    )}
  </Component>
);

export const FormRadioSelect = ({
  field,
  field: { name, value },
  form: { touched, errors },
  options,
  ...props
}) => (
  <>
    {hasErrors(errors, touched, name) && (
      <FormFieldError>
        {/* Radio Select will only ever error when they are required so we
            will simplify the messaging for the front-end */}
        {errors[name]}
        <FormFieldErrorIcon css={checkboxRadioErrorIcon} />
      </FormFieldError>
    )}
    <RadioSelect {...props}>
      {processOptions(options).map((option, idx) => {
        const formValue = normalizeOption(value);
        const optionValue = normalizeOption(option.value);
        return (
          <label key={idx}>
            {option.label}
            <input
              type="radio"
              {...field}
              value={optionValue}
              checked={formValue === optionValue}
            />
            <span />
          </label>
        );
      })}
    </RadioSelect>
  </>
);

export const FormMultiCheckbox = ({
  field,
  form: { touched, errors, setFieldValue, setFieldTouched },
  ...props
}) => {
  const fieldName = field.name;
  const fieldValues = field.value || [];
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
                checked={fieldValues.includes(value)}
                name={fieldName}
                onChange={e => {
                  const newSelects = e.target.checked
                    ? fieldValues.concat([value])
                    : fieldValues.filter(option => option !== value);
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

export const FomAutoComplete = ({
  field: { value, name },
  form: { touched, errors, setFieldValue, setFieldTouched },
  options,
  errorText,
}) => (
  <AutoCompleteWrapper>
    {hasErrors(errors, touched, name) && (
      <FormFieldError>{errorText || errors[name]}</FormFieldError>
    )}
    <ReactAutocomplete
      items={processOptions(options)}
      shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
      getItemValue={item => item.label}
      renderMenu={items => <AutoCompleteMenu children={items} />}
      renderItem={(item, highlighted) => (
        <AutoCompleteOption key={item.value} highlighted={highlighted}>
          {item.label}
        </AutoCompleteOption>
      )}
      value={value}
      onChange={e => {
        setFieldValue(name, e.target.value);
        setFieldTouched(name);
      }}
      onSelect={value => setFieldValue(name, value)}
    />
  </AutoCompleteWrapper>
);

export const FormLabelHeader = ({ labelText, description }) => (
  <FormBlock>
    <FormBlockLabel>{labelText}:</FormBlockLabel>
    {description && <FormFieldDesc>{description}</FormFieldDesc>}
  </FormBlock>
);
