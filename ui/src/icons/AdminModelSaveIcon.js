import { BaseSvg } from 'icons';

export default ({ fill = '#fff', ...props }) =>
  BaseSvg({
    svg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-save</title><path class="cls-1" d="M0,0H35l7,7V42H0ZM10,3H3V39H39V8.24L33.76,3H32V14H10ZM21,18a8.5,8.5,0,1,1-8.5,8.5A8.51,8.51,0,0,1,21,18Zm0,3a5.5,5.5,0,1,0,5.5,5.5A5.5,5.5,0,0,0,21,21ZM13,11H29V3H13Z"/></svg>`,
    ...props,
  });
