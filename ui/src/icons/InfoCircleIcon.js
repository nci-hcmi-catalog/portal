import React from 'react';
import { InlineSvg } from 'icons';

const InfoCircleIcon = ({
  fill = '#0969da',
  width = '16px',
  height = '16px',
  viewBox = '0 0 16 16',
  ...props
}) =>
  InlineSvg({
    alt: 'Information Icon',
    viewBox,
    width,
    height,
    fill,
    ariaHidden: true,
    focusable: false,
    path: (
      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    ),
    ...props,
  });

export default InfoCircleIcon;
