import { BaseSvg } from 'icons';

export default ({ fill = '#900000', ...props }) =>
  BaseSvg({
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-checkmark</title><path class="cls-1" d="M45,0A45,45,0,1,0,90,45,45.07,45.07,0,0,0,45,0Zm0,85.8A40.75,40.75,0,1,1,85.8,45.1,40.84,40.84,0,0,1,45,85.8Z"/><path class="cls-1" d="M60.4,32.4c-6.9,7.1-13.8,14.1-20.7,21.2-3.6-3.7-7.1-7.4-10.7-11.1-1.9-2-4.9,1-3,3,4.1,4.2,8.1,8.4,12.2,12.6a2.17,2.17,0,0,0,3,0C48.6,50.5,56,42.9,63.4,35.4,65.2,33.4,62.3,30.4,60.4,32.4Z"/></svg>`,
    ...props,
  });
