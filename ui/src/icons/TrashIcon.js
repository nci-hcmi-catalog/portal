import { BaseSvg } from 'icons';

export default ({ fill = '#900000', ...props }) =>
  BaseSvg({
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 18"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-garbage</title><path class="cls-1" d="M7.5,15a.5.5,0,0,0,.5-.5v-6a.5.5,0,0,0-1,0v6A.5.5,0,0,0,7.5,15Zm3,0a.51.51,0,0,0,.5-.5v-6a.5.5,0,0,0-1,0v6A.51.51,0,0,0,10.5,15ZM14,2H10V1A1,1,0,0,0,9,0H6A1,1,0,0,0,5,1V2H1A1,1,0,0,0,0,3V6H1V16a2,2,0,0,0,2,2h9a2,2,0,0,0,2-2V6h1V3A1,1,0,0,0,14,2ZM6,1.5A.5.5,0,0,1,6.5,1h2a.5.5,0,0,1,.5.5V2H6ZM13,16a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V6H13ZM14,5H1V3.5A.5.5,0,0,1,1.5,3h12a.5.5,0,0,1,.5.5ZM4.5,15a.5.5,0,0,0,.5-.5v-6a.5.5,0,0,0-1,0v6A.5.5,0,0,0,4.5,15Z"/></svg>`,
    ...props,
  });
