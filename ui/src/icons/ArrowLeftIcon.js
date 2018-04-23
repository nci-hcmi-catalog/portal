import { BaseSvg } from 'icons';

export default ({ fill = '#900000', ...props }) =>
  BaseSvg({
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.83 90.93"><defs><style>.cls-1{fill:${fill};}</style></defs><path class="cls-1" d="M38,3.05l-35,35a10.54,10.54,0,0,0,0,14.83l35,35A10.42,10.42,0,0,0,52.78,73.14L25.1,45.46,52.78,17.79A10.42,10.42,0,0,0,38,3.05"/></svg>`,
    ...props,
  });
