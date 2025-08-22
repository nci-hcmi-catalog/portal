import React from 'react';
import Popup from 'reactjs-popup';

const ToolTip = ({ position = 'top center', disabled = false, offsetY = 2, trigger, children }) => (
  <Popup
    trigger={trigger}
    position={position}
    contentStyle={{
      padding: '6px 12px',
      border: 'none',
      borderRadius: '10px',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '13px',
      width: 'max-content',
    }}
    on="hover"
    offsetY={offsetY}
    // If tooltip is not disabled, show the tooltip,
    // like normal, otherwise delay it for a very long time
    // (since there is no way to disable it all together)
    mouseEnterDelay={disabled ? 1000 * 1000 : 100}
  >
    {children}
  </Popup>
);

export default ToolTip;
