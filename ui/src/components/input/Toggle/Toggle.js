import React, { useEffect, useState } from 'react';

import { ToggleButton } from 'theme/searchStyles';

const Toggle = ({ id, initialValue, onValueChange, ...props }) => {
  const [toggleValue, setToggleValue] = useState(initialValue);

  const toggle = e => {
    e.preventDefault();

    setToggleValue(!toggleValue);

    if (onValueChange) {
      onValueChange();
    }
  };

  useEffect(() => {
    setToggleValue(initialValue);
  }, [initialValue]);

  return (
    <ToggleButton
      id={id}
      role="switch"
      aria-checked={toggleValue ? 'true' : 'false'}
      checked={toggleValue}
      onClick={toggle}
      {...props}
    />
  );
};

export default Toggle;
