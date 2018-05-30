import React from 'react';
export default ({ percentage, fill = `#900000`, width = 30, style, ...props }) => (
  <div
    style={{
      width,
      height: 8,
      backgroundColor: `rgb(209, 209, 209)`,
      margin: '0 5px',
      borderRadius: 2,
      display: 'inline-block',
      pointerEvents: 'none',
      ...style,
    }}
    {...props}
  >
    <div
      style={{
        left: 0,
        width: percentage > 0 ? percentage * width : 0,
        height: 8,
        backgroundColor: fill,
        borderRadius: 2,
      }}
    />
  </div>
);
