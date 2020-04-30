import { BaseSvg } from 'icons';

export default ({ fill = '#FFFFFF', ...props }) =>
  BaseSvg({
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-CMS-add</title><path class="cls-1" fill-rule="evenodd" d="M13.886 10.962H10.97v2.933a.97.97 0 0 1-.971.962.97.97 0 0 1-.971-.962v-2.933H6.114A.97.97 0 0 1 5.143 10a.97.97 0 0 1 .971-.962H9.03V6.105A.97.97 0 0 1 10 5.143a.97.97 0 0 1 .971.962v2.933h2.915a.97.97 0 0 1 .971.962.97.97 0 0 1-.971.962M10 0C4.476 0 0 4.476 0 10s4.476 10 10 10 10-4.476 10-10S15.524 0 10 0"/></svg>`,
    ...props,
  });
