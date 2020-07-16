import { BaseSvg } from 'icons';

export default ({ fill = '#900000', ...props }) =>
  BaseSvg({
    alt: 'External Sources Icon',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 90 90"><defs><style>.cls-1{fill:none;clip-rule:evenodd;}.cls-2{fill:${fill};}.cls-3{clip-path:url(#clip-path);}</style><clipPath id="clip-path"><path class="cls-1" d="M52,32.37l-.13.12L42,42.58a2.91,2.91,0,0,0,0,4.09L43.3,48a2.81,2.81,0,0,0,4,0l10-10.09.11-.12,3.06,3.09c1.11,1.13,2,.75,2-.85V28.5a1,1,0,0,0-1-1H50.12c-1.59,0-1.95.92-.84,2.05ZM33.36,27.54a5.81,5.81,0,0,0-5.82,5.82V56.64a5.81,5.81,0,0,0,5.82,5.82H56.64a5.81,5.81,0,0,0,5.82-5.82V49.85L56.64,45v8.72a2.9,2.9,0,0,1-2.9,2.9H36.26a2.9,2.9,0,0,1-2.9-2.9V36.26a2.9,2.9,0,0,1,2.9-2.9H45l-4.85-5.82H33.36Z"/></clipPath></defs><title>icon-external-links</title><path class="cls-2" d="M45,0A45,45,0,1,0,90,45,45,45,0,0,0,45,0Zm0,86.54A41.54,41.54,0,1,1,86.54,45,41.54,41.54,0,0,1,45,86.54Z"/><g class="cls-3"><rect class="cls-2" x="18.81" y="18.81" width="52.39" height="52.39"/></g></svg>`,
    ...props,
  });
