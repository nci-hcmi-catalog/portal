import React from 'react';
import { InlineSvg } from 'icons';

const ExternalLinkIcon = ({
  fill = 'currentColor',
  width = '12px',
  height = '12px',
  viewBox = '0 0 44.33 44.33',
  ...props
}) =>
  InlineSvg({
    alt: 'External Link Icon',
    viewBox,
    width,
    height,
    fill,
    path: (
      <>
        <path
          fill={fill}
          d="M35.88,22.73a2.82,2.82,0,0,0-2.82,2.82v12a1.18,1.18,0,0,1-1.18,1.18H6.82a1.18,1.18,0,0,1-1.18-1.18V12.45a1.18,1.18,0,0,1,1.18-1.17h12a2.82,2.82,0,1,0,0-5.64h-12A6.83,6.83,0,0,0,0,12.45V37.52a6.82,6.82,0,0,0,6.82,6.81H31.88a6.82,6.82,0,0,0,6.82-6.81v-12A2.82,2.82,0,0,0,35.88,22.73Z"
        />
        <path
          fill={fill}
          d="M37.52,0H25.83a2.82,2.82,0,1,0,0,5.64h8.88L16,24.35a2.82,2.82,0,1,0,4,4L38.7,9.63V18.5a2.82,2.82,0,1,0,5.63,0V6.82A6.82,6.82,0,0,0,37.52,0Z"
        />
      </>
    ),
    ...props,
  });

export default ExternalLinkIcon;
