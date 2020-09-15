import React from 'react';

import { Tab } from 'theme/horizontalTabStyles';

export default ({ active, disabled, onClick, children, ...props }) => {
  const clickHandler = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <Tab active={active} disabled={disabled} onClick={clickHandler} {...props}>
      {children}
    </Tab>
  );
};
