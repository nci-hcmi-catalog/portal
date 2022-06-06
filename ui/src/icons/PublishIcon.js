import React from 'react';
import { InlineSvg } from 'icons';

const PublishIcon = ({
  fill = 'currentColor',
  width = '11px',
  height = '11px',
  viewBox = '0 0 92.93 82.72',
  ...props
}) =>
  InlineSvg({
    alt: 'Publish Icon',
    viewBox,
    width,
    height,
    fill,
    path: (
      <path d="M4.56,47.22,35,56.09v22a4.65,4.65,0,0,0,4.65,4.63,4.7,4.7,0,0,0,3.27-1.36L54.65,69.68l11.21,8.45a7.53,7.53,0,0,0,11.89-4.38L92.83,6A5,5,0,0,0,86.07.36L3.85,35.19a6.4,6.4,0,0,0,.71,12ZM40,77.22V58.64l10.62,8Zm32.87-4.6a2.54,2.54,0,0,1-4,1.47L41.8,53.74,57.9,38.08,73.68,69Zm2.52-11.26L61.65,34.43,86.83,9.93ZM57.57,31.42H25.5l57-24.17ZM5.8,39.79l7.93-3.37H52.45L37,51.42l-31-9a1.4,1.4,0,0,1-.15-2.63Z" />
    ),
    ...props,
  });

export default PublishIcon;
