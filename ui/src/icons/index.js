import React from 'react';

// svg data uris need to be encodeURI()ed plus #'s encoded to work in non webkit
// https://gist.github.com/clhenrick/6791bb9040a174cd93573f85028e97af
export const encodeSVG = svg => encodeURI(svg).replace('#', '%23');

export const BaseSvg = ({ alt = '', height, width, svg, style, className, ...props }) => (
  <img
    src={`data:image/svg+xml;utf8,${encodeSVG(svg)}`}
    alt={alt}
    css={`
      width: ${width}px;
      height: ${height}px;
      margin-right: 5px;
      ${className};
      ${style};
    `}
    {...props}
  />
);

export const InlineSvg = ({ viewBox, path, height, width, fill, className, alt, ...props }) => (
  <svg
    css={`
      height: ${height};
      width: ${width};
      fill: ${fill};
      margin-right: 5px;
      ${className};
    `}
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    role="img"
    {...props}
  >
    {alt && <title>{alt}</title>}
    {path}
  </svg>
);
