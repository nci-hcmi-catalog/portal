import React from 'react';
import styled from 'react-emotion';
import { css } from 'emotion';
import ArrangerTextInput from '@arranger/components/dist/Input';
import CrossCircleOutlineIcon from 'icons/CrossCircleOutlineIcon';

const TextInputWrapper = styled('div')`
  position: relative;
  padding: 0 !important;
  label: text-input-wrapper;
`;

const RefArrangerTextInput = React.forwardRef((props, ref) => (
  <ArrangerTextInput componentRef={ref} {...props} />
));

const TextInput = styled(RefArrangerTextInput)`
  padding-right: 25px;
  label: text-input;
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

const setNativeValue = (element, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
};

export default ({ className, value, disabled, ref = React.createRef(), ...props }) => {
  const clearInput = () => {
    const input = ref.current.children[1];
    setNativeValue(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <TextInputWrapper disabled={disabled} className={className}>
      <TextInput {...{ value, disabled, ...props }} componentRef={ref} />
      {value && value.length && <CrossCircleOutlineIcon style={closeStyle} onClick={clearInput} />}
    </TextInputWrapper>
  );
};
