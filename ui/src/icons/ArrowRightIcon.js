import React from 'react';
import { InlineSvg } from 'icons';

export default ({ width = '6px', height = '8px', viewBox = '0 0 75 100', ...props }) =>
  InlineSvg({
    viewBox,
    width,
    height,
    path: (
      <path d="M17.79,87.88l35-35a10.54,10.54,0,0,0,0-14.83l-35-35A10.42,10.42,0,0,0,3.05,17.79L30.73,45.46,3.05,73.14A10.42,10.42,0,0,0,17.79,87.88" />
    ),
    ...props,
  });
