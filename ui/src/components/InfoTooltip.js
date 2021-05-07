import React, { useState } from 'react';
import Popup from 'reactjs-popup';

import QuestionMarkIcon from 'icons/QuestionMarkIcon';

const InfoTooltip = ({ children, ariaLabel, iconStyle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const showTooltip = () => {
    setIsOpen(true);
  };

  const hideTooltip = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      trigger={() => (
        <div
          css={`
            display: flex;
            position: absolute;
            right: 0;
            top: 4px;
            ${iconStyle}
          `}
        >
          <QuestionMarkIcon
            aria-label={ariaLabel}
            tabIndex={0}
            onFocus={showTooltip}
            onBlur={hideTooltip}
          />
        </div>
      )}
      on={['hover', 'focus']}
      open={isOpen}
      onOpen={showTooltip}
      onClose={hideTooltip}
      position={'top right'}
      contentStyle={{
        width: '380px',
      }}
      mouseEnterDelay={100}
    >
      <div
        css={`
          font-size: 12px;
        `}
      >
        {children}
      </div>
    </Popup>
  );
};

export default InfoTooltip;
