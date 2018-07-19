import { BaseSvg } from 'icons';

export default ({ fill = '#fff', ...props }) =>
  BaseSvg({
    svg: `<svg id="user_icon" data-name="User Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54.58 68.05"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-user</title><path class="cls-1" d="M27.29,34.76c9.6,0,16.12-7.78,16.12-17.38S36.89,0,27.29,0,11.17,7.78,11.17,17.38,17.69,34.76,27.29,34.76Z"/><path class="cls-1" d="M40.31,33.62a19.27,19.27,0,0,1-13,4.92,19.27,19.27,0,0,1-13-4.92A27.4,27.4,0,0,0,0,56.48a38,38,0,0,0,54.58,0A27.4,27.4,0,0,0,40.31,33.62Z"/></svg>`,
    ...props,
  });
