import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import ArrangerInput from '@overture-stack/arranger-components/dist/Input';
import CrossCircleOutlineIcon from 'icons/CrossCircleOutlineIcon';
import FilterIcon from 'icons/FilterIcon';

const TextInputWrapper = styled('div')`
  position: relative;
  padding: 0 !important;
  label: text-input-wrapper;
`;

const RefArrangerTextInput = React.forwardRef((props, ref) => (
  <ArrangerInput
    ref={ref}
    shouldautofocus={'false'}
    theme={{ leftIcon: { Icon: FilterIcon } }}
    {...props}
  />
));

const TextInput = styled(RefArrangerTextInput)`
  padding-right: 25px;
  padding-left: 10px;
  label: text-input;
  box-shadow: none !important;
  border: solid 1px #b2b7c1;
  border-weight: 1px !important;

  > input {
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    font-weight: normal;
    color: #525767;
    padding: 0;

    &:focus {
      box-shadow: none;
    }
  }
  > span.inputIcon {
    padding-bottom: 1px;
    color: #b2b7c1;
  }

  :hover {
    border-color: #4596de;
  }

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(21, 156, 228, 0.4) !important;
  }
`;

const closeStyle = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 4px;
  width: 14px;
  height: 14px;
  border-radius: 6px;
`;

const TextInputComponent = ({
  className,
  value,
  setValue,
  disabled,
  ref = React.createRef(),
  ...props
}) => {
  const clearInput = () => {
    setValue('');
  };

  return (
    <TextInputWrapper disabled={disabled} className={className}>
      <TextInput ref={ref} {...{ value, disabled, ...props }} />
      {value && value.length && <CrossCircleOutlineIcon css={closeStyle} onClick={clearInput} />}
    </TextInputWrapper>
  );
};

export default TextInputComponent;
