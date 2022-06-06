import { BaseSvg } from 'icons';

const CrossIcon = ({ fill = '#ED494C', width = '13px', height = '13px', ...props }) =>
  BaseSvg({
    alt: 'Close Icon',
    width,
    height,
    svg: `<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><path d="m4.996 6.75-2.87 2.87c-1.153 1.155-2.895-.6-1.754-1.74l2.882-2.883-2.882-2.87c-1.14-1.154.601-2.896 1.754-1.755l2.87 2.882 2.884-2.882c1.14-1.14 2.895.601 1.742 1.754l-2.87 2.87 2.87 2.883c1.153 1.14-.601 2.895-1.742 1.742z" fill="${fill}" fill-rule="evenodd"/></svg>`,
    ...props,
  });

export default CrossIcon;
