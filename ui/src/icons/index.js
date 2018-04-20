import React from 'react';

// svg data uris need # encoded also but encodeURI will not do that
// https://gist.github.com/clhenrick/6791bb9040a174cd93573f85028e97af
export const encodeSVG = svg => encodeURI(svg).replace('#', '%23');

export const BaseSvg = ({ alt = '', height, width, svg, style, className, ...props }) => (
  <img
    src={`data:image/svg+xml;utf8,${encodeSVG(svg)}`}
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
