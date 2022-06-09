import React from 'react';

const CollapsibleArrow = ({ isOpen, size = 10, weight = 2, colour = '#64666A', ...props }) => {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={size}
      fill="transparent"
      stroke={colour}
      strokeWidth={weight + 'px'}
      transform={isOpen ? 'rotate(180)' : null}
      {...props}
    >
      <title>{isOpen ? 'Click to close' : 'Click to open'}</title>
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  );
};

export default CollapsibleArrow;
