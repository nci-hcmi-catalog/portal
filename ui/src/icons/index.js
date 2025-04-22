import React from 'react';
import { css } from '@emotion/react';

// svg data uris need to be encodeURI()ed plus #'s encoded to work in non webkit
// https://gist.github.com/clhenrick/6791bb9040a174cd93573f85028e97af
export const encodeSVG = (svg) => encodeURI(svg).replace(/#/g, '%23');

export const BaseSvg = ({ alt = '', height, width, svg, ...props }) => (
  <img
    src={`data:image/svg+xml;utf8,${encodeSVG(svg)}`}
    alt={alt}
    css={css`
      width: ${width};
      height: ${height};
      margin-right: 5px;
    `}
    {...props}
  />
);

export const InlineSvg = ({ viewBox, path, height, width, fill, alt, ...props }) => (
  <svg
    css={css`
      height: ${height};
      width: ${width};
      fill: ${fill};
      margin-right: 5px;
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
