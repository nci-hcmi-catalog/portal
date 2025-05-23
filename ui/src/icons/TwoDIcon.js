import React from 'react';
import { InlineSvg } from 'icons';

const twoDIcon = (props) =>
  InlineSvg({
    viewBox: '0 0 33.07 33.28',
    width: '20px',
    height: '20px',
    path: (
      <>
        <path d="M24.84,25.7H11a3.26,3.26,0,0,1-3.25-3.25V8.62A3.26,3.26,0,0,1,11,5.37H24.84a3.26,3.26,0,0,1,3.25,3.25V22.45A3.26,3.26,0,0,1,24.84,25.7ZM11,7.87a.76.76,0,0,0-.75.75V22.45a.76.76,0,0,0,.75.75H24.84a.76.76,0,0,0,.75-.75V8.62a.76.76,0,0,0-.75-.75Z" />
        <path d="M31.69,30.53H2.75V1.38A1.38,1.38,0,1,0,0,1.38V31.69s0,.08,0,.11,0,.07,0,.11a1.37,1.37,0,0,0,1.38,1.37H31.69a1.38,1.38,0,1,0,0-2.75Z" />
      </>
    ),
    ...props,
  });

export default twoDIcon;
