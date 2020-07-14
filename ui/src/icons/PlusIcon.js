import React from 'react';
import { InlineSvg } from 'icons';

export default ({
  fill = 'currentColor',
  width = '11px',
  height = '11px',
  viewBox = '0 0 20 20',
  ...props
}) =>
  InlineSvg({
    alt: 'Plus Icon',
    viewBox,
    width,
    height,
    fill,
    path: (
      <path
        fillRule="evenodd"
        d="M13.886 10.962H10.97v2.933a.97.97 0 0 1-.971.962.97.97 0 0 1-.971-.962v-2.933H6.114A.97.97 0 0 1 5.143 10a.97.97 0 0 1 .971-.962H9.03V6.105A.97.97 0 0 1 10 5.143a.97.97 0 0 1 .971.962v2.933h2.915a.97.97 0 0 1 .971.962.97.97 0 0 1-.971.962M10 0C4.476 0 0 4.476 0 10s4.476 10 10 10 10-4.476 10-10S15.524 0 10 0"
      />
    ),
    ...props,
  });
