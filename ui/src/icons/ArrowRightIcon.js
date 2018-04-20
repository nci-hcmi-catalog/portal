import { BaseSvg } from 'icons';

export default ({ fill = '#900000', ...props }) =>
  BaseSvg({
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.83 90.93"><defs><style>.cls-1{fill:${fill};}</style></defs><path class="cls-1" d="M17.79,87.88l35-35a10.54,10.54,0,0,0,0-14.83l-35-35A10.42,10.42,0,0,0,3.05,17.79L30.73,45.46,3.05,73.14A10.42,10.42,0,0,0,17.79,87.88"/></svg>`,
    ...props,
  });
