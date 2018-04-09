import React from 'react';

export default ({ alt = '', height, width, fill = '#900000', style, className, ...props }) => (
  <img
    src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><defs><style>.cls-1{fill:${fill};}</style></defs><path class="cls-1" d="M45,0A45,45,0,1,0,90,45,45.05,45.05,0,0,0,45,0Zm0,86.54A41.54,41.54,0,1,1,86.54,45,41.59,41.59,0,0,1,45,86.54Z"/><path class="cls-1" d="M45,49.79c9.6,0,16.12-7.78,16.12-17.38S54.6,15,45,15,28.88,22.81,28.88,32.41,35.4,49.79,45,49.79Z"/><path class="cls-1" d="M58,48.65a19.69,19.69,0,0,1-26,0A27.4,27.4,0,0,0,17.71,71.51a38,38,0,0,0,54.58,0A27.4,27.4,0,0,0,58,48.65Z"/></svg>`}
    alt={alt}
    css={`
      width: ${width}px;
      height: ${height}px;
      margin-right: 10px;
      ${className};
      ${style};
    `}
    {...props}
  />
);
