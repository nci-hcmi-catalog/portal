import { BaseSvg } from 'icons';

export default ({ fill = '#fff', size = 10, ...props }) =>
  BaseSvg({
    svg: `<svg id="user_icon" data-name="User Icon" height="${size}" viewBox="0 0 20 20" width="${size}" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:${fill};}</style></defs><title>icon-user</title><g fill="none" fill-rule="evenodd"><path d="m14.695 2.694a5.215 5.215 0 0 0 -9.13 5.043 5.134 5.134 0 0 0 2.043 2.043c-3.826.696-6.608 2.87-6.608 5.61v3.565c.043.608.565 1.087 1.174 1.043h15.956a1.051 1.051 0 0 0 1.13-1.043v-3.565c0-2.696-2.74-4.913-6.609-5.609a5.215 5.215 0 0 0 2.044-7.086z" class="cls-1"/></g></svg>`,
    ...props,
  });
