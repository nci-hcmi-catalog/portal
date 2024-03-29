import { BaseSvg } from 'icons';

const ErrorTriangleIcon = ({ fill = '#ffffff', width = '30px', height = '30px', ...props }) =>
  BaseSvg({
    alt: 'Error Icon',
    width,
    height,
    svg: `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="m15 2c-.848 0-1.631.423-2.066 1.155l-12.608 21.303c-.434.734-.435 1.64 0 2.374.363.612 1.051 1.17 1.901 1.168h25.546c.85 0 1.537-.556 1.9-1.168.436-.733.435-1.64 0-2.374l-12.606-21.303c-.437-.732-1.218-1.155-2.067-1.155" fill="${fill}"/><path d="m14.843 20.556c-1.239 0-2.243.994-2.243 2.222 0 1.227 1.004 2.222 2.243 2.222s2.242-.995 2.242-2.222c0-1.228-1.003-2.222-2.242-2.222m0-11.556c-1.239 0-2.243.995-2.243 2.222l.449 6.667c0 .982.803 1.778 1.794 1.778.99 0 1.794-.796 1.794-1.778l.448-6.667c0-1.227-1.003-2.222-2.242-2.222" fill="#fff"/></g></svg>`,
    ...props,
  });

export default ErrorTriangleIcon;
