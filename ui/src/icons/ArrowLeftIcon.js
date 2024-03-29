import React from 'react';
import { InlineSvg } from 'icons';

const ArrowLeftIcon = ({
  fill = 'currentColor',
  width = '6px',
  height = '8px',
  viewBox = '0 0 75 100',
  ...props
}) =>
  InlineSvg({
    alt: 'Left Arrow Icon',
    viewBox,
    width,
    height,
    fill,
    path: (
      <path d="M38,3.05l-35,35a10.54,10.54,0,0,0,0,14.83l35,35A10.42,10.42,0,0,0,52.78,73.14L25.1,45.46,52.78,17.79A10.42,10.42,0,0,0,38,3.05" />
    ),
    ...props,
  });

export default ArrowLeftIcon;
