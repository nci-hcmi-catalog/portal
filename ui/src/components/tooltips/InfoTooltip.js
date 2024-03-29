import React, { useState } from 'react';
import { css } from '@emotion/react';
import Popup from 'reactjs-popup';

import QuestionMarkIcon from 'icons/QuestionMarkIcon';

const InfoTooltip = ({
  children,
  ariaLabel,
  iconStyle,
  infoStyle = {},
  position = 'top right',
  width = '380px',
}) => {
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
          css={css`
            display: flex;
            position: absolute;
            right: 0;
            top: 4px;
            z-index: 50;
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
      position={position}
      contentStyle={{
        width: width || '380px',
        zIndex: 100,
        transform: 'translate3d(0, 0, 0)',
        ...infoStyle,
      }}
      mouseEnterDelay={100}
    >
      <div
        css={css`
          font-size: 12px;
          font-weight: normal;
          text-transform: none;
        `}
      >
        {children}
      </div>
    </Popup>
  );
};

export default InfoTooltip;
