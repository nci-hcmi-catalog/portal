import { BaseSvg } from 'icons';

export default ({ fill = '#900000', ...props }) =>
  BaseSvg({
    svg: `<svg id="Isolation_Mode" data-name="Isolation Mode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90"><defs><style>.cls-1{fill:${fill}}</style></defs><title>icon-close-red</title><path class="cls-1" d="M45,0A45,45,0,1,0,90,45,45.05,45.05,0,0,0,45,0Zm0,86.54A41.54,41.54,0,1,1,86.54,45,41.59,41.59,0,0,1,45,86.54Z"/><path class="cls-1" d="M60.55,54.27a4.33,4.33,0,0,1,0,6.28,4.33,4.33,0,0,1-6.28,0L45,51.28l-9.27,9.27a4.33,4.33,0,0,1-6.28,0,4.33,4.33,0,0,1,0-6.28L38.72,45l-9.27-9.27a4.44,4.44,0,1,1,6.28-6.28L45,38.72l9.27-9.27a4.44,4.44,0,0,1,6.28,6.28L51.28,45Z"/></svg>`,
    ...props,
  });
