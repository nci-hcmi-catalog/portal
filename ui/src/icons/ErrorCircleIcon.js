import { BaseSvg } from 'icons';

const ErrorCircleIcon = ({ fill = '#900000', ...props }) =>
  BaseSvg({
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.6 67.6"><defs><style>.cls-1{fill:${fill};}</style></defs><path class="cls-1" d="M33.8,0A33.8,33.8,0,1,0,67.6,33.8,33.82,33.82,0,0,0,33.8,0Zm0,62.8a29,29,0,1,1,29-29A29,29,0,0,1,33.8,62.8Z"/><path class="cls-1" d="M33.8,49.1a2.79,2.79,0,0,1-2-.8,2.94,2.94,0,0,1-.7-1.9,2.73,2.73,0,0,1,.8-1.9,2.78,2.78,0,0,1,3.8,0,2.73,2.73,0,0,1,.8,1.9,2.56,2.56,0,0,1-.8,1.9A2.36,2.36,0,0,1,33.8,49.1Z"/><path class="cls-1" d="M33.8,38.1a2.69,2.69,0,0,1-2.7-2.7V21.2a2.7,2.7,0,0,1,5.4,0V35.4A2.69,2.69,0,0,1,33.8,38.1Z"/></svg>`,
    ...props,
  });

export default ErrorCircleIcon;
