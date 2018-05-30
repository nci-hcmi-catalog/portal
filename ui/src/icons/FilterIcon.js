import { BaseSvg } from 'icons';

export default ({ fill = '#900000', ...props }) =>
  BaseSvg({
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><style>.cls-1{fill:${fill};}</style></defs><path class="cls-1" d="M488,0H24C2.71,0-8,25.87,7.06,41L192,225.94V432a24,24,0,0,0,10.24,19.66l80,56C298,518.69,320,507.49,320,488v-262L505,41C520,25.9,509.34,0,488,0Z" transform="translate(0)"/></svg>`,
    ...props,
  });
