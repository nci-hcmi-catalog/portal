import { BaseSvg } from 'icons';

export default ({ fill = '#1C8292', ...props }) =>
  BaseSvg({
    svg: `<svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-CMS-edit</title><path class="cls-1" d="m17.975.718c-.96-.957-2.51-.957-3.471 0l-12.63 12.576c-.048.05-.073.074-.098.123 0 0 0 .025-.024.025-.025.049-.05.074-.05.123v.024l-1.672 5.453c-.074.27 0 .54.172.737.148.147.32.221.517.221.074 0 .148 0 .221-.025l5.441-1.67h.025c.049-.024.098-.024.123-.049 0 0 .024 0 .024-.024.05-.025.099-.05.123-.099l12.604-12.576c.96-.958.96-2.505 0-3.463z" fill-rule="evenodd"/></svg>`,
    ...props,
  });
