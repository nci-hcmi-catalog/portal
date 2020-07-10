import React from 'react';
import uuid from 'uuid/v4';

import Component from 'react-component-component';
import ReactAutocomplete from 'react-autocomplete';
import moment from 'moment-timezone';
import { isEqual } from 'lodash';
import {
  FormBlock,
  FormBlockLabel,
  FormFieldDesc,
  FormWarningLabel,
  Input,
  Select,
  AutoCompleteWrapper,
  AutoCompleteMenu,
  AutoCompleteOption,
  AutoCompleteClearButton,
  DatePicker,
  CheckBoxes,
  RadioSelect,
  FormFieldError,
  inputSelectErrorIcon,
  checkboxRadioErrorIcon,
} from 'theme/formComponentsStyles';
import FormFieldErrorIcon from 'icons/FormFieldErrorIcon';
import ClearXIcon from 'icons/ClearXIcon';
import WarningIcon from 'icons/WarningIcon';

const hasErrors = (errors, touched, fieldName) => touched[fieldName] && errors[fieldName];

const normalizeOption = option => (option === 'true' ? true : option === 'false' ? false : option);

// Map simple string/number options to keyed objects
const processOptions = options =>
  options
    .sort()
    .map(option =>
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
    <Input
      type={type}
      {...field}
      {...props}
      aria-label={`${field.name}`}
      errors={hasErrors(errors, touched, field.name)}
    />
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
      aria-label={field.name}
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
          id={field.name}
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
        const optionId = uuid();
        return (
          <label key={idx} htmlFor={`radio-option-${optionId}`}>
            {option.label}
            <input
              type="radio"
              id={`radio-option-${optionId}`}
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
          const optionId = uuid();
          return (
            <label key={idx} htmlFor={`checkbox-option-${optionId}`}>
              {name}
              <input
                type="checkbox"
                id={`checkbox-option-${optionId}`}
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

export const FormAutoComplete = ({
  field: { value, name },
  form: { touched, errors, setFieldValue, setFieldTouched },
  options,
  errorText,
  warning = false,
  warningText = null,
  clearable = false,
  onSelect = () => {},
}) => {
  const select = value => {
    onSelect(value);
    setFieldValue(name, value);
  };
  return (
    <AutoCompleteWrapper warning={warning}>
      {hasErrors(errors, touched, name) && (
        <FormFieldError>{errorText || errors[name]}</FormFieldError>
      )}
      {warning && warningText && (
        <>
          <FormWarningLabel>{warningText}</FormWarningLabel>
          <WarningIcon
            width={23}
            height={23}
            style={`
              position: absolute;
              right: -34px;
              bottom: 6px;
            `}
          />
        </>
      )}
      <ReactAutocomplete
        type="search"
        inputProps={{ 'aria-label': `${name}-options` }}
        items={processOptions(options)}
        shouldItemRender={(item, value) =>
          item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
        }
        getItemValue={item => item.label}
        renderMenu={items => <AutoCompleteMenu children={items} />}
        renderItem={(item, highlighted) => (
          <AutoCompleteOption
            id={item.value}
            name={item.value}
            aria-label={item.label}
            key={item.value}
            highlighted={highlighted}
          >
            {item.label}
          </AutoCompleteOption>
        )}
        value={value}
        onChange={e => {
          setFieldValue(name, e.target.value);
          setFieldTouched(name);
          onSelect();
        }}
        onSelect={value => select(value)}
      />
      {value && clearable && (
        <AutoCompleteClearButton onClick={() => select('')}>
          <ClearXIcon />
        </AutoCompleteClearButton>
      )}
    </AutoCompleteWrapper>
  );
};

export const FormLabelHeader = ({ labelText, description }) => (
  <FormBlock>
    <FormBlockLabel>{labelText}:</FormBlockLabel>
    {description && <FormFieldDesc>{description}</FormFieldDesc>}
  </FormBlock>
);
