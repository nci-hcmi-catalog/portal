import { BaseSvg } from 'icons';

export default ({ fill = '#b2b7c1', height = '16px', width = '16px', ...props }) =>
  BaseSvg({
    alt: 'Filter Icon',
    height,
    width,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><style>.cls-1{fill:${fill};}</style></defs><path class="cls-1" d="M31.41,28.59l-7.92-7.94a13.06,13.06,0,1,0-2.83,2.83l7.92,7.93a2,2,0,0,0,2.83-2.82ZM4,13a9,9,0,1,1,9,9A9,9,0,0,1,4,13Z"/></svg>`,
    ...props,
  });
