import { BaseSvg } from 'icons';

const ShareIcon = ({ fill = '#900000', height = '12px', width = '12px', ...props }) =>
  BaseSvg({
    alt: 'Share Icon',
    height,
    width,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78.6 89.8"><defs><style>.cls-1{fill:${fill};}</style></defs><path class="cls-1" d="M63.5,59.8a14.5,14.5,0,0,0-9.7,3.8l-24.3-15a15.06,15.06,0,0,0,.6-3.6,13.64,13.64,0,0,0-.6-3.7L53.8,26.4A15.25,15.25,0,0,0,63.5,30a15,15,0,1,0-15-15,8.08,8.08,0,0,0,.6,3.5L24.8,33.6A15.62,15.62,0,0,0,15,29.9,15.07,15.07,0,0,0,0,45,14.87,14.87,0,0,0,15,59.8a15.44,15.44,0,0,0,9.8-3.5L49.1,71.2a8.53,8.53,0,0,0-.6,3.6,15.05,15.05,0,1,0,15-15Z"/></svg>`,
    ...props,
  });

export default ShareIcon;
