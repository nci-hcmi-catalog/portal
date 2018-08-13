import { BaseSvg } from 'icons';

export default ({ fill = '#900000', ...props }) =>
  BaseSvg({
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 2"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-more-options</title><path class="cls-1" d="M9,2a1,1,0,1,1,1-1A1,1,0,0,1,9,2ZM5,2A1,1,0,1,1,6,1,1,1,0,0,1,5,2ZM1,2A1,1,0,1,1,2,1,1,1,0,0,1,1,2Z"/></svg>`,
    ...props,
  });
