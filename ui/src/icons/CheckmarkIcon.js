import { BaseSvg } from 'icons';

export default ({ fill = '#FFFFFF', height = '12px', width = '12px', ...props }) =>
  BaseSvg({
    alt: 'Checkmark Icon',
    height,
    width,
    svg: `<svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="m.561 12.193c-1.716-1.717.894-4.327 2.61-2.61l3.319 3.317 10.34-10.34c1.716-1.716 4.326.894 2.61 2.61l-11.646 11.646c-.72.72-1.89.72-2.61 0z" fill="${fill}"/></g></svg>`,
    ...props,
  });
