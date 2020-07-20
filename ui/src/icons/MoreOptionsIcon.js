import React from 'react';
import { InlineSvg } from 'icons';

export default ({
  width = '18px',
  height = '17px',
  fill = 'currentColor',
  viewBox = '0 0 10 2',
  ...props
}) =>
  InlineSvg({
    alt: 'More Options Icon',
    viewBox,
    width,
    height,
    fill,
    path: (
      <path d="M9,2a1,1,0,1,1,1-1A1,1,0,0,1,9,2ZM5,2A1,1,0,1,1,6,1,1,1,0,0,1,5,2ZM1,2A1,1,0,1,1,2,1,1,1,0,0,1,1,2Z" />
    ),
    ...props,
  });
